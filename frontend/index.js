const internships = [
  {
    title: "Frontend Intern",
    company: "TechNova",
    location: "Remote",
    category: "Tech",
    duration: "3 months",
    stipend: 5000
  },
  {
    title: "UI/UX Intern",
    company: "DesignHub",
    location: "Mumbai",
    category: "Design",
    duration: "2 months",
    stipend: 4000
  },
  {
    title: "Marketing Analyst Intern",
    company: "BrandX",
    location: "Bangalore",
    category: "Marketing",
    duration: "6 months",
    stipend: 6000
  }
];

const listContainer = document.getElementById("internship-list");
const searchInput = document.getElementById("search");
const categorySelect = document.getElementById("category");
const locationSelect = document.getElementById("location");
const sortSelect = document.getElementById("sort");

function displayInternships(data) {
  listContainer.innerHTML = "";
  data.forEach(item => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <h3>${item.title}</h3>
      <p><strong>Company:</strong> ${item.company}</p>
      <p><strong>Location:</strong> ${item.location}</p>
      <p><strong>Category:</strong> ${item.category}</p>
      <p><strong>Duration:</strong> ${item.duration}</p>
      <p><strong>Stipend:</strong> ₹${item.stipend}/month</p>
      <button onclick="saveInternship(this.parentElement.innerHTML)">🔖 Save</button>
    `;
    listContainer.appendChild(div);
  });
}

function filterAndSort() {
  let filtered = internships.filter(intern => {
    const search = searchInput.value.toLowerCase();
    const category = categorySelect.value;
    const location = locationSelect.value;
    return (
      (intern.title.toLowerCase().includes(search) || intern.company.toLowerCase().includes(search)) &&
      (category === "all" || intern.category === category) &&
      (location === "all" || intern.location === location)
    );
  });

  if (sortSelect.value === "high") {
    filtered.sort((a, b) => b.stipend - a.stipend);
  } else if (sortSelect.value === "low") {
    filtered.sort((a, b) => a.stipend - b.stipend);
  }

  displayInternships(filtered);
}

function saveInternship(cardHTML) {
  const saved = JSON.parse(localStorage.getItem("savedInternships")) || [];
  if (!saved.includes(cardHTML)) {
    saved.push(cardHTML);
    localStorage.setItem("savedInternships", JSON.stringify(saved));
    alert("Internship saved!");
  } else {
    alert("Already saved!");
  }
}

searchInput.addEventListener("input", filterAndSort);
categorySelect.addEventListener("change", filterAndSort);
locationSelect.addEventListener("change", filterAndSort);
sortSelect.addEventListener("change", filterAndSort);

displayInternships(internships);
