function editDetails(fieldId) {
    const field = document.getElementById(fieldId);
    const editBtn = field.nextElementSibling;
    const studentId = field.dataset.studentid;

    if (field.disabled) {
        field.disabled = false;
        field.classList.add('editable');
        editBtn.textContent = 'Save';
    } else {
        const updatedValue = field.value;
        const name = (fieldId === 'studentName') ? updatedValue : document.getElementById("studentName").value;
        const email = (fieldId === 'studentEmail') ? updatedValue : document.getElementById("studentEmail").value;
        const phone = (fieldId === 'studentPhone') ? updatedValue : document.getElementById("studentPhone").value;

        const updatedData = {
            fieldId: fieldId,
            value: updatedValue,
            studentId: studentId,
            name: name,
            email: email,
            phone: phone
        };

        fetch('/updateProfile', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedData),
        })
        .then((response) => response.json())
        .then((data) => {
            console.log(data); 
            // Optionally, handle response data if needed
        })
        .catch((error) => {
            console.error('Error:', error);
        });

        field.disabled = true;
        field.classList.remove('editable');
        editBtn.textContent = 'Edit';

        const newValue = field.value; 
        const detailContent = field.parentElement.querySelector('.detail-content');
        detailContent.innerHTML = `
            <input type="${field.type}" value="${newValue}" disabled>
            <button class="edit-btn" onclick="editDetails('${fieldId}')">Edit</button>
        `;

        console.log(`Updated ${fieldId}: ${newValue}`);
    }
}
