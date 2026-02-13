const { glob } = require('glob');
const fs = require('fs');
const { parse } = require('node-html-parser');

// Configuration
const SRC_DIR = 'src/app/**/*.component.html';

// Elements that should have i18n
const TEXT_ELEMENTS = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span', 'div', 'label', 'button', 'a', 'strong', 'em', 'li', 'th', 'td', 'option'];
// Attributes that should have i18n
const I18N_ATTRIBUTES = ['placeholder', 'title', 'alt'];

function scanFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const root = parse(content, { comment: true });
    
    const violations = [];
    const lines = content.split('\n');

    function getLineNumber(index) {
        return content.substring(0, index).split('\n').length;
    }

    // Check Text Content
    TEXT_ELEMENTS.forEach(tag => {
        const elements = root.querySelectorAll(tag);
        elements.forEach(el => {
            // Check for direct text content
            const textContent = el.childNodes
                .filter(node => node.nodeType === 3) // Text node
                .map(node => node.text.trim())
                .join('');
            
            if (textContent.length > 0 && !el.hasAttribute('i18n')) {
                // Ignore purely interpolated text (e.g. {{ var }}) if that's the policy, 
                // but usually even that might need i18n. For now, let's flag if it has any text.
                // Refinement: If it starts with {{ and ends with }}, maybe skip? 
                // Let's be strict: if it has meaningful text and no i18n, flag it.
                
                // Simple check: does it look like purely {{ ... }}?
                if (!/^\{\{.*\}\}$/.test(textContent)) {
                   violations.push({
                        file: filePath,
                        line: getLineNumber(el.range[0]),
                        message: `Element <${tag}> with text "${textContent.substring(0, 20)}..." is missing 'i18n' attribute.`
                   });
                }
            }
        });
    });

    // Check Attributes
    const allElements = root.querySelectorAll('*');
    allElements.forEach(el => {
        I18N_ATTRIBUTES.forEach(attr => {
            if (el.hasAttribute(attr)) {
                const attrVal = el.getAttribute(attr);
                if (attrVal && attrVal.trim().length > 0 && !el.hasAttribute(`i18n-${attr}`)) {
                     // Start simple: if it has placeholder="foo", it needs i18n-placeholder
                     if (!/^\{\{.*\}\}$/.test(attrVal)) {
                        violations.push({
                            file: filePath,
                            line: getLineNumber(el.range[0]),
                            message: `Element <${el.tagName.toLowerCase()}> with attribute '${attr}="${attrVal.substring(0, 20)}..."' is missing 'i18n-${attr}' attribute.`
                        });
                     }
                }
            }
        });
    });

    return violations;
}

async function main() {
    try {
        const files = await glob(SRC_DIR);
        console.log(`Scanning ${files.length} files...`);

        let allViolations = [];
        files.forEach(file => {
            const fileViolations = scanFile(file);
            allViolations = allViolations.concat(fileViolations);
        });

        if (allViolations.length > 0) {
            console.log('i18n Violations Found:');
            console.log(JSON.stringify(allViolations, null, 2));
            
            // Output to a file for GitHub Action to read
            fs.writeFileSync('i18n-report.json', JSON.stringify(allViolations, null, 2));
            process.exit(1); // Fail the build
        } else {
            console.log('No i18n violations found.');
            process.exit(0);
        }
    } catch (err) {
        console.error('Glob Error:', err);
        process.exit(1);
    }
}

main();
