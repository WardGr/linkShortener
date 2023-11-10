async function test() {
    try {
        const response = await fetch(`http://localhost:8000/33`, { method: 'GET' });
        const data = await response.json();
        console.log(data);
    } catch (err) {
        console.error(err);
    }
}

test().catch((err) => {
    console.error(err);
});
