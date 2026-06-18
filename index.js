const form = document.getElementById("form");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const confirmPassword =
    document.getElementById("password-check").value;

  if (
    name === "" ||
    email === "" ||
    password === "" ||
    confirmPassword === ""
  ) {
    showAlert("Please fill all fields");
    return;
  }

  if (password.length < 6) {
    showAlert("Password must be at least 6 characters");
    return;
  }

  if (password !== confirmPassword) {
    showAlert("Passwords do not match");
    return;
  }

  alert("Validation successful");
});



//Supabase auth

import { createClient } from
'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabaseUrl = "https://yrgydqeiucbtcrfmjura.supabase.co";
const supabaseKey = "sb_publishable_ZU3DjhAgxTsqfqPFiH4WVg_z5qLYjz5";

const supabase = createClient(
  supabaseUrl,
  supabaseKey
);


form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email =
    document.getElementById("email").value;

  const password =
    document.getElementById("password").value;

  const { data, error } =
    await supabase.auth.signUp({
      email,
      password,
    });

  if (error) {
    showAlert(error.message);
    return;
  }

  showAlert(
    "Account created successfully."
  );

  console.log(data);
  window.location.href = "Login.html";
});


// code for alerts //

function showAlert(message, type = "success") {

  const alert = document.getElementById("alert");

  alert.textContent = message;

  // color based on type
  alert.style.background =
    type === "error" ? "#e74c3c" : "#111";

  alert.classList.add("show");

  setTimeout(() => {
    alert.classList.remove("show");
  }, 2500);

}
