const resField = document.getElementById('link');
window.onload = function() {
    addListener();
}

function navbar() {
    var x = document.getElementById("navbar");
    x.classList.toggle("responsive");
}

function addListener() {
    document.getElementById('add').addEventListener('click', function() {
        const link = document.getElementById('link').value;
        const url = 'https://link.boozydev.com/api/addKey';

        if (includesHttp(link)) {
            fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ link: link }),
            }).then(response => response.json())
                .then(data => {
                    console.log(data);
                    resField.value = "link.boozydev.com/api/" + data.result;
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        } else { alert("Links must include HTTP / HTTPS!")};

    });
}

function copy() {
    var inputField = document.getElementById("link");
    inputField.select();
    inputField.setSelectionRange(0, 99999);
    document.execCommand("copy");
    inputField.blur();
}

function includesHttp(input) {
    if (input.toUpperCase().startsWith("HTTP://") || input.toUpperCase().startsWith("HTTPS://")) {
        return true;
    }
    return false;
}
