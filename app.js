const form = document.getElementById("budget-form");
const desc = document.getElementById("desc");
const amount = document.getElementById("amount");
const type = document.getElementById("type");

const totalIncomeEl = document.getElementById("total-income");
const totalExpenseEl = document.getElementById("total-expense");
const balanceEl = document.getElementById("balance");
const list = document.getElementById("transaction-list");

let income = 0;
let expense = 0;

const chartCtx = document.getElementById("budget-chart").getContext("2d");
let chart = new Chart(chartCtx, {
  type: 'doughnut',
  data: {
    labels: ['Income', 'Expense'],
    datasets: [{
      data: [income, expense],
      backgroundColor: ['#4CAF50', '#F44336'],
    }]
  }
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const value = parseFloat(amount.value);

  if (!desc.value || isNaN(value) || value <= 0) {
    alert("Please enter valid data");
    return;
  }

  if (type.value === "income") {
    income += value;
  } else {
    expense += value;
  }

  animateValue("total-income", parseInt(totalIncomeEl.textContent), income, 500);
  animateValue("total-expense", parseInt(totalExpenseEl.textContent), expense, 500);
  animateValue("balance", parseInt(balanceEl.textContent), income - expense, 500);

  // Update chart
  chart.data.datasets[0].data = [income, expense];
  chart.update();

  // Add to transaction list
  const li = document.createElement("li");
  li.className = type.value;
  li.textContent = `${desc.value} - ₹${value}`;
  list.prepend(li);

  // Clear input fields
  desc.value = "";
  amount.value = "";
});

// Reset Button
document.getElementById("reset").addEventListener("click", () => {
  income = 0;
  expense = 0;
  totalIncomeEl.textContent = 0;
  totalExpenseEl.textContent = 0;
  balanceEl.textContent = 0;
  list.innerHTML = "";
  chart.data.datasets[0].data = [0, 0];
  chart.update();
});

// Animation function
function animateValue(id, start, end, duration) {
  const range = end - start;
  let startTime = null;

  const step = (timestamp) => {
    if (!startTime) startTime = timestamp;
    const progress = Math.min((timestamp - startTime) / duration, 1);
    const value = Math.floor(progress * range + start);
    document.getElementById(id).textContent = value;
    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };

  window.requestAnimationFrame(step);
}