// EMERGENCY SCRIPT - REMOVE PROBLEMATIC CONTENT
// This script forcefully removes any content containing problematic phrases

(function() {
    'use strict';
    
    const PROBLEMATIC_PHRASES = [
        'Pronto para provar',
        'desejado da Suíça',
        'CHF',
        'Erdbeere'
    ];
    
    const PROBLEMATIC_CLASSES = [
        'product-card',
        'product-grid',
        'products-grid',
        'pricing-section',
        'pricing-grid'
    ];
    
    function removeProblematicContent() {
        // Remove by text content
        PROBLEMATIC_PHRASES.forEach(phrase => {
            document.querySelectorAll('*').forEach(element => {
                if (element.textContent && element.textContent.includes(phrase)) {
                    console.log('REMOVING ELEMENT WITH PHRASE:', phrase, element);
                    element.remove();
                }
            });
        });
        
        // Remove by classes
        PROBLEMATIC_CLASSES.forEach(className => {
            document.querySelectorAll(`.${className}`).forEach(element => {
                console.log('REMOVING ELEMENT WITH CLASS:', className, element);
                element.remove();
            });
        });
        
        // Remove elements with product-related attributes
        document.querySelectorAll('[class*="product"]').forEach(element => {
            console.log('REMOVING PRODUCT-RELATED ELEMENT:', element);
            element.remove();
        });
        
        // Remove pricing section specifically
        const pricingSection = document.getElementById('precos');
        if (pricingSection) {
            console.log('REMOVING PRICING SECTION:', pricingSection);
            pricingSection.remove();
        }
        
        // Remove any navigation links that might lead to problematic content
        document.querySelectorAll('a[href*="product"], a[href*="precos"]').forEach(link => {
            console.log('REMOVING PROBLEMATIC LINK:', link);
            link.remove();
        });
    }
    
    // Run immediately
    removeProblematicContent();
    
    // Run after DOM is loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', removeProblematicContent);
    }
    
    // Run after window is loaded
    window.addEventListener('load', removeProblematicContent);
    
    // Monitor for dynamic content injection
    function startObserver() {
        if (document.body) {
            const observer = new MutationObserver(function(mutations) {
                let shouldClean = false;
                
                mutations.forEach(function(mutation) {
                    if (mutation.addedNodes.length) {
                        mutation.addedNodes.forEach(function(node) {
                            if (node.nodeType === Node.ELEMENT_NODE) {
                                // Check if added node contains problematic content
                                PROBLEMATIC_PHRASES.forEach(phrase => {
                                    if (node.textContent && node.textContent.includes(phrase)) {
                                        console.log('DETECTED DYNAMIC INJECTION OF PROBLEMATIC CONTENT:', phrase, node);
                                        shouldClean = true;
                                    }
                                });
                                
                                // Check if added node has problematic classes
                                PROBLEMATIC_CLASSES.forEach(className => {
                                    if (node.classList && node.classList.contains(className)) {
                                        console.log('DETECTED DYNAMIC INJECTION OF PROBLEMATIC CLASS:', className, node);
                                        shouldClean = true;
                                    }
                                });
                            }
                        });
                    }
                });
                
                if (shouldClean) {
                    setTimeout(removeProblematicContent, 100);
                }
            });
            
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        } else {
            // If body doesn't exist yet, wait a bit and try again
            setTimeout(startObserver, 100);
        }
    }
    
    // Start observing
    startObserver();
    
    // Definir variável global para verificação
window.emergencyCleanupActive = true;

console.log('EMERGENCY CLEANUP SCRIPT ACTIVATED - MONITORING FOR PROBLEMATIC CONTENT');
})();