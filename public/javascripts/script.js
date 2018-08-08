document.addEventListener('DOMContentLoaded', () => {

  console.log('IronGenerator JS imported successfully!');

}, false);

/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */
function showMembersInput() {
  document.getElementById("myDropdown").classList.toggle("show");
}


// Sifts through all the users in user model while user is searching for friends to add
function filterFunction() {
  var input, filter, ul, li, a, i;
  input = document.getElementById("userInput");
  filter = input.value.toUpperCase();
  div = document.getElementById("myDropdown");
  a = div.getElementsByTagName("a");
  for (i = 0; i < a.length; i++) {
    if (a[i].innerHTML.toUpperCase().indexOf(filter) > -1) {
      a[i].style.display = "";
    } else {
      a[i].style.display = "none";
    }
  }
}

// This adds the friend added to a form on the page so user can see who they're adding
// and it'll be uploaded through post method
function addMember(){
    const field = document.getElementById('usersField');
    const input = capitalize(document.getElementById('userInput').value);
    let checkbox = document.createElement('input');
    let label = document.createElement('label');

    checkbox.type = 'checkbox';
    checkbox.value = input;
    checkbox.name = 'users';
    checkbox.checked = true;

    label.innerText = input;
    console.log(label);

    field.appendChild(checkbox);
    field.appendChild(label);
  
}

// Deletes button and shows edit form for certain CRUD applications
function showForm(hideButton, displayForm, hidebutton2, hidebutton3){
  const Button = document.getElementById(hideButton);
  const Form = document.getElementById(displayForm);
  const button2 = document.getElementById(hidebutton2);
  const button3 = document.getElementById(hidebutton3);
  Button.style = 'display:none';
  Form.style = '';
  button2.style= 'display:none';
  button3.style= '';
}
