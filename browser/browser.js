const resField = document.getElementById('link');
window.onload = function () {
    addListener();
}

function navbar() {
    var x = document.getElementById("navbar");
    x.classList.toggle("responsive");
}

function addListener() {
    document.getElementById('add').addEventListener('click', function () {
        const link = document.getElementById('link').value;

        const url = 'https://link.boozydev.com/api/addKey';
        if (includesHttp(link)) {
            pingLink(link).then((res) => {
                console.log(res);
                if (!res) {
                    return;
                }
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
            })
        } else { alert("Links must include HTTP / HTTPS!") };

    });
}

async function pingLink(link) {
    const linkWithoutHttp = link.toLowerCase().replace("http://", "").replace("https://", "");
    const linkWithoutPath = linkWithoutHttp.split("/")[0];
    const res = await fetch(`https://dns.google/resolve?name=${linkWithoutPath}`)
    if (res.status >= 200 && res.status < 300) {
        const data = await res.json();
        if (data.Answer) {
            console.log(data.Answer[0].data);
            return true;
        } else {
            alert("Invalid link!");
            return false;
        }
    } else {
        alert("network error!")
        return false;
    }
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
