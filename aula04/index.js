// document.querySelector() -> Busca por seletor 1: element
// document.querySelectorAll() -> Busca por seletor n elements
// document.getElementById() -> Busca por seletor que é um ID

const searchParams = new URLSearchParams(window.location.search);

const githubLogin = searchParams.get("githubLogin") || "kevenleone";

const avatar = document.querySelector("img");
const name_ = document.getElementById("name");
const username = document.getElementById("username");
const bio = document.getElementById("bio");

const followers = document.getElementById("followers");
const following = document.getElementById("following");
const stars = document.getElementById("stars");

const company = document.getElementById("company");
const city = document.getElementById("city");
const email = document.getElementById("email");

function setGithubData(data) {
  avatar.src = data.avatar_url;

  name_.innerText = data.name;
  username.innerText = data.login;
  bio.innerText = data.bio;

  followers.innerText = data.followers;
  following.innerText = data.following;
  stars.innerText = Number(Math.random() * 10000).toFixed(0);

  company.innerHTML = data.company;
  city.innerHTML = data.location;
  email.innerHTML = data.email || `${data.login}@contact.me`;
}

async function main() {
  const response = await fetch(`https://api.github.com/users/${githubLogin}`);

  const data = await response.json();

  setGithubData(data);
}

main();
