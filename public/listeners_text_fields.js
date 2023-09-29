// allows 'Enter' key to work if corresponding text field is focused

var textField = document.querySelectorAll('.assign_pt_input')[0];
textField.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && document.activeElement.classList.contains('assign_pt_input')) {
        document.getElementById('assign_pt_button').click();
    }
    });

var textField2 = document.querySelectorAll('.advance_doc_input')[0];
textField2.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && document.activeElement.classList.contains('advance_doc_input')) {
        document.getElementById('advance_doc').click();
    }
    });
    