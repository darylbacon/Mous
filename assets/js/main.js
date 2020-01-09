import data from './_incs/data'

// DOM selectors
const nodes = {
  viewStaffBtn: document.querySelector('[el="staff-btn"]'),
  staffList:    document.querySelector('[el="staff-list"]'),
}

// Click event listeners
function setClickEvents() {
  nodes.viewStaffBtn.addEventListener('click', () => {
    showStaffMembers()
  })
}

// Show the staff members to the user
function showStaffMembers() {
  loadStaffMembers()
  .then((staff) => {
    nodes.staffList.innerHTML = staff;
  })
  .catch((err) => {
    nodes.staffList.innerHTML = `
      <li class="staff-member staff-member--error">
        <p>${err}</p>
      </li>
    `;
  })
}

// Load the staff members from the data
function loadStaffMembers() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Object.entries(data).length) {
        let members = '';
        data.forEach((member) => {
          members += getMemberTemplate(member);
        });
        resolve(members);
      } else {
        reject(new Error('There is no data.'));
      }
    }, 500);
  })
}

// Return the HTML markup for a staff member
function getMemberTemplate(member) {
  return `
    <li class="staff-member">
      <div class="staff-member__inner">
        <img class="staff-member__img" src="${member.img}" alt="Headshot photo of ${member.name}">

        <div class="staff-member__details">
          <h2 class="staff-member__name">${member.name}</h2>

          <h3 class="staff-member__job">${member.occupation}</h3>

          <div class="staff-member__team">${member.team}</div>
        </div>
      </div>
    </li>
  `
}

// Initialise the script
function init() {
  setClickEvents()
}

// Wait for the DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
  init()
})