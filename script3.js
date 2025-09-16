document.addEventListener('DOMContentLoaded', function () {
    var readmorebtn = document.getElementById('readmore');
    var readmorebtn2 = document.getElementById('readmore2');
    var infodiv = document.getElementById('info');
    var infodiv2 = document.getElementById('info2');


    function readmoreButton () {
        toggleVisibilityBlock(infodiv);
    }

    function readmoreButton2 () {
        toggleVisibilityBlock(infodiv2);
    }

    // Function to toggle the visibility of an element
    function toggleVisibilityBlock(element) {
        if (element.style.display === 'none' || element.style.display === '') {
            element.style.display = 'block';
        } else {
            element.style.display = 'none';
        }
    }

    readmorebtn.addEventListener('click', function () { readmoreButton(); }); 
    readmorebtn2.addEventListener('click', function () { readmoreButton2(); }); 
});