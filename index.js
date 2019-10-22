let selects = document.querySelector(".pokemon-dropdown-select")
let pokemonProfile = document.querySelector('.pokemon-post-container')
let followingPosts = document.querySelector('.following-posts-container')

let displayForm = false

get("http://localhost:3000/pokemons")
.then(respJSON => {
    respJSON.forEach(opt => {
        let newOption = document.createElement('option')
        newOption.className = 'selected'
        newOption.value = opt[0]
        newOption.innerText = opt[1]
        selects.append(newOption)
    })
})

selects.addEventListener('change', evt => {
    evt.preventDefault()
    let selected = evt.target.value
    get(`http://localhost:3000/pokemons/${selected}`)
    .then(respJSON => {
        createProfile(respJSON)
        createFollowingDropdown(respJSON)
    })
})

function removeChildren(parentNode) {  
    while (parentNode.firstChild) { 
      parentNode.removeChild(parentNode.firstChild)  
    }
  }

function get(url){
return fetch(url)
.then(resp => resp.json())
}

function createProfile(obj){
    
    removeChildren(pokemonProfile)
    
    let profileCard = document.createElement('div')
        let profileName = document.createElement('h3')
            profileName.innerText = `${obj.species}`
            profileName.className = 'pokemon-name'

        let followerCount = document.createElement('h4')
            followerCount.className = 'follower-count'
            followerCount.innerText = ' followers'

            let countSpan = document.createElement('span')
                countSpan.innerText = `${obj.followers.length}`
            followerCount.prepend(countSpan)

        let profilePic = document.createElement('img')
            profilePic.src = `${obj.image}`
            profilePic.alt = `${obj.species}-pic`
            profilePic.height = '100'
            profilePic.width = '100'

        let formContainer = document.createElement('div')
            formContainer.className = 'form-container'

            let createPostForm = document.createElement('form')
                createPostForm.className = 'create-post-form'

                let formHeader = document.createElement('h3')
                    formHeader.innerText = 'New Post'

                let captionInput = document.createElement('input')
                    captionInput.type = 'text'
                    captionInput.value = ""
                    captionInput.placeholder = "Caption..."
                    captionInput.className = "input-text"
                
                let br = document.createElement('br')

                let imageInput = document.createElement('input')
                    imageInput.type = 'text'
                    imageInput.value = ""
                    imageInput.placeholder = "Image URL..."
                    imageInput.className = 'input-text'

                let submitForm = document.createElement('input')
                    submitForm.type = 'submit'
                    submitForm.name = 'submit'
                    submitForm.value = 'Submit Post'
                    submitForm.className = 'submit'

            createPostForm.append(formHeader, captionInput, br, imageInput, br, submitForm)

        formContainer.append(createPostForm)

        //Still need to work on toggling the form to display-------------------------
        let toggleForm = document.createElement('p')
            // toggleForm.style = 'text-align: center'
            toggleForm.innerText = '+ Post'
            toggleForm.addEventListener('click', evt => {
                formDisplay(toggleForm)
            })

        let profilePostsContainer = document.createElement('div')
            profilePostsContainer.className = 'pokemon-posts-container'

        obj.posts.forEach(post => {
            let postDiv = document.createElement('div')
                let postImage = document.createElement('img')
                    postImage.src = post.image
                    postImage.height = '125'
                    postImage.width = '100'

                let postCaption = document.createElement('p')
                    postCaption.innerText = post.caption

            postDiv.append(postImage, postCaption)
            profilePostsContainer.append(postDiv)
        })

    profileCard.append(profileName, followerCount, profilePic, formContainer, toggleForm, profilePostsContainer)
    pokemonProfile.append(profileCard)
}

//This toggle function still needs work---------------------------------------
function formDisplay(toggleForm){
    displayForm = !displayForm

    if (displayForm){
        toggleForm.style.display = 'block'
    } else {
        toggleForm.style.display = 'none'
    }
}

function createFollowingDropdown(obj){
    console.log(obj.following)
    removeChildren(followingPosts)
    let followingSelection = document.createElement('select')
        followingSelection.className = 'pokemon-dropdown-select'
        followingSelection.innerHTML = `<option value="" disabled selected>Select a Pokemon to View</option>`

        obj.following.forEach(following => {
            let followingOption = document.createElement('option')
                followingOption.className = 'selected'
                followingOption.value = following.dataId
                followingOption.innerText = following.species
            followingSelection.append(followingOption)
        })
    followingPosts.append(followingSelection)
}