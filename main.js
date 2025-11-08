
document.getElementById('csvFile').addEventListener('change', handleFileSelect);

function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            // استدعاء دالة لمعالجة النص
            processCSV(e.target.result); 
        };
        reader.readAsText(file);
    }
}
function processCSV(csvText) {
    // تقسيم النص إلى صفوف (سطر جديد)
    const rows = csvText.split('\n').filter(row => row.trim() !== '');

    // هنا يمكن افتراض أن كل سطر هو رقم هاتف
    // في الواقع، إذا كان لديك أعمدة، فستحتاج إلى فصلها (باستخدام الفاصلة ،)

    let htmlContent = '<table>';
    rows.forEach((row, index) => {
        const phoneNumber = row.trim().split(',')[0]; // نفترض أن الرقم في العمود الأول

        if (phoneNumber) {
            htmlContent += `
                <tr>
                    <td>
                        <input type="checkbox" id="check-${index}" data-number="${phoneNumber}">
                    </td>
                    <td>
                        <a href="tel:${phoneNumber}">${phoneNumber}</a> 
                    </td>
                </tr>
            `;
        }
    });
    htmlContent += '</table>';

    document.getElementById('dataContainer').innerHTML = htmlContent;
}