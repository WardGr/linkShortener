window.onload = function() {
    document.getElementById('add').addEventListener('click', function() {
        const link = document.getElementById('link').value;
        const url = 'http://localhost:8000/addKey';
        fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ link: link }),
        }).then(response => {
            console.log(response);
        });
    });
}