function editDetails(fieldId) {
    const field = document.getElementById(fieldId);
    const editBtn = field.nextElementSibling;
    const adminId = field.dataset.AdminId;

    if (field.disabled) {
        field.disabled = false;
        field.classList.add('editable');
        editBtn.textContent = 'Save';
    } else {
        const updatedValue = field.value;
        const name = (fieldId === 'AdminName') ? updatedValue : document.getElementById("AdminName").value;
        const email = (fieldId === 'AdminEmail') ? updatedValue : document.getElementById("AdminEmail").value;
        const phone = (fieldId === 'AdminPhone') ? updatedValue : document.getElementById("AdminPhone").value;

        const updatedData = {
            fieldId: fieldId,
            value: updatedValue,
            AdminId: adminId,
            name: name,
            email: email,
            phone: phone
        };

        fetch('/updateAdminProfile', {
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
