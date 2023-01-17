import { emptyMode } from "./main.js"

export class GithubUser {
  static search(username) {
    const endpoint = `https://api.github.com/users/${username}`
    
    return fetch(endpoint)
    .then(data => data.json())
    .then(({ login, name, public_repos, followers}) => ({
        login,
        name,
        public_repos,
        followers
    }))
  }
}

export class Favorites {
  constructor(root) {
    this.root = document.querySelector(root)
    this.load()
  }

  load() {
    this.entries = JSON.parse(localStorage.getItem
    ("@github-favorites:")) || []

  }

  save() {
    localStorage.setItem
    ("@github-favorites:", JSON.stringify(this.entries))
  }

  async add(username) {
    try {

      const userExist = this.entries.find(entry => entry.login === username)

      if (userExist) {
        throw new Error("Usuário já cadastrado!")
      }

      const user = await GithubUser.search(username)


      if(user.login === undefined) {
        throw new Error("usuário não encontrado!")
      }

      this.entries = [user, ...this.entries]
      this.update()
      this.save()
      this.arrayLenght()   
      

    } catch(error) {
      alert(error.message)
    }
  }

  delete(user) {
    const filteredEntries = this.entries
    .filter(entry => entry.login !== user.login)

    this.entries = filteredEntries
    this.update()
    this.save()
    this.arrayLenght() 
  }

   arrayLenght() {
    const numberUsers = this.entries.length

     if(numberUsers === 0) {
      this.emptyMessage()
    } else {
      this.noEmptyMessage()
    }
  }

  emptyMessage = () => {emptyMode.classList.add("on")}
  
  noEmptyMessage = () => {emptyMode.classList.remove("on")}
}

export class FavoritesView extends Favorites {
  constructor(root) {
    super(root)

    this.tbody = this.root.querySelector("table tbody")
    this.update()
    this.onadd()
  }

  onadd() {
    const addButton = document.querySelector(".favorite button")
    addButton.onclick = () => {
      const { value } = this.root.querySelector(".favorite input")

      this.add(value)
    }
  }

  update() {
    this.removeAllTr()

    this.entries.forEach( user => {
      const row = this.createRow()

      row.querySelector(".user img").src = `https://www.github.com/${user.login}.png`
      row.querySelector(".user img").alt = `Imagem de ${user.name}`
      row.querySelector(".user a").href = `https://www.github.com/${user.login}`
      row.querySelector(".user p").textContent = user.name
      row.querySelector(".user span").textContent = `${user.login}`
      row.querySelector(".repositories").textContent = user.public_repos
      row.querySelector(".followers").textContent = user.followers

      row.querySelector(".remove").onclick = () => {
        const isOk = confirm("Tem certeza que deseja apagar este usuário?")
        if(isOk) {
          this.delete(user)
        }
      }
      this.tbody.append(row)
    })
  }
  
  createRow() {
    const tr = document.createElement("tr")

    tr.innerHTML = `          
          <td class="user"> 
            <img src="https://www.github.com/user.png" alt="Imagem do usuário">
            <a href="https://www.github.com/user">
              <p>Pedro</p>
              <span>/rovedabr</span>
            </a>
          </td>
          <td class="repositories">
            124
          </td>
          <td class="followers">
            5000
          </td>
            <td><button class="remove">Remove</button>
          </td>
          `
    return tr
  }
  
  removeAllTr() {
    this.tbody.querySelectorAll("tr")
    .forEach((tr) => {
      tr.remove()
    })
  }
  
}