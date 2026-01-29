document.addEventListener('DOMContentLoaded', function() {
    let button = document.getElementById("button-add");
    
    button.addEventListener("click", function() {
        const name = document.getElementById("name").value.trim();
        const age = document.getElementById("age").value.trim();
        const date = document.getElementById("date").value;
        const domain = document.getElementById("domain").value.trim();
        
        if(name && age && date && domain){
            const container = document.getElementById("container-2");
            const div = document.createElement("div");
            div.setAttribute("class", "todo-item");
            div.innerHTML = `<h2>${name}</h2>
                            <h3>Age: ${age}</h3>
                            <h3>Date: ${formatDate(date)}</h3> 
                            <h3>Domain: ${domain}</h3>
                            <button onclick="deleteEntry(event)">Delete</button>`; 
            container.appendChild(div);

            // Clear input fields
            document.getElementById("name").value = "";
            document.getElementById("age").value = "";
            document.getElementById("date").value = "";
            document.getElementById("domain").value = "";
        } else {
            alert("Please fill in all fields");
        }
    });
});

function deleteEntry(event){
    if(confirm("Are you sure you want to delete this item?")) {
        event.target.parentElement.remove();
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}