'use strict';

(function (window, document) {
    const button = document.getElementById('generate');

    const buildDictionary = function (text) {
        const dictionary = { start: {}, middle: {}, end: {} };
        
        text.match(/[^\s]+/g).map(word => {
            word.split('`').map(function (syllable, index, syllables) {
                if (syllable) {
                    let current =
                        index === 0? dictionary.start:
                        index === (syllables.length - 1)? dictionary.end:
                        dictionary.middle;

                    if (current[syllable]) {
                        ++current[syllable];
                    } else {
                        current[syllable] = 1;
                    }
                }
            });
        });

        return dictionary;
    };

    button.addEventListener('click', function () {
        const input = document.getElementById('input').textContent;
        const dictionary = buildDictionary(input);

        alert(JSON.stringify(dictionary));
    });
})(window, window.document);