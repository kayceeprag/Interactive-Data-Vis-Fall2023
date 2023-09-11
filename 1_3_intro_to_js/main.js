document.addEventListener('DOMContentLoaded', function() {
    const button = document.getElementById('countButton');
    const counter = document.getElementById('counter');
    let clickCount = 0;
    button.addEventListener('click', () => {
            clickCount++;
        counter.innerText = clickCount;
    });

    const nameInput = document.getElementById('name');
    const ageInput = document.getElementById('age');
    const emailInput = document.getElementById('email');
    const submitButton = document.getElementById('submitButton');
    const displayInfo = d3.select('#displayInfo');

    const userInfo = {
        name: '',
        age: '',
        email: ''
    };

    submitButton.addEventListener('click', () => {

        userInfo.name = nameInput.value;
        userInfo.age = ageInput.value;
        userInfo.email = emailInput.value;

        displayInfo.html('');

        displayInfo.append('p').text(`Name: ${userInfo.name}`);
        displayInfo.append('p').text(`Age: ${userInfo.age}`);
        displayInfo.append('p').text(`Email: ${userInfo.email}`);
    });
});
