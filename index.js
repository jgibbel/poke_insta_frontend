let selects = document.querySelector(".pokemon-dropdown-select")
let pokemonProfile = document.querySelector('.profile-container')
let followingPosts = document.querySelector('.following-posts-container')
let followingSelection = document.querySelector('.following-dropdown-select')
let followingDropdown = followingPosts.querySelector('.following-dropdown')
let chosenFollow = followingPosts.querySelector('.selected-posts-container')

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
        removeChildren(pokemonProfile)
        removeChildren(followingSelection)
        removeChildren(chosenFollow)

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
                    postImage.height = '130'
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
    let formContainer = document.querySelector('.form-container')

    if (displayForm){
        formContainer.style.display = 'block'
    } else {
        formContainer.style.display = 'none'
    }
}

function createFollowingDropdown(obj){
        let i = 0
        followingSelection.innerHTML = `<option value="" disabled selected>Select a Pokemon to View</option>`
        obj.follows.forEach(following => {
            let followingOption = document.createElement('option')
                followingOption.className = 'selected'
                followingOption.value = i
                followingOption.innerText = following.following_name
            followingSelection.append(followingOption)
            i += 1
        })

        followingSelection.addEventListener('change', evt => {
            let x = evt.target.value
            createPosts(obj.follows[x])
        })

    followingDropdown.append(followingSelection)
}

function createPosts(obj){
    removeChildren(chosenFollow)
    obj.posts.forEach(function(post){
        makePostCard(post, obj)
    })

}
// to edit:

function makePostCard(postObj, parentObj) {
    let postCard = document.createElement('div')
        postCard.className = "post-card"

    let proPicDiv = document.createElement('div')
        proPicDiv.className = "profile-link"
    let propic = document.createElement("img") 
        propic.src = parentObj.image
        propic.alt = "Profile Thumbnail" 
        propic.height  = 25 
        propic.width = 25 
        proPicDiv.appendChild(propic) 
        // proPicDiv.addEventListener("click", function(e) {} )
    
    let mainImageDiv = document.createElement('div')
        mainImageDiv.className = "post-image"
    let pic = document.createElement("img") 
        pic.src = postObj.image 
        pic.alt = "Image File" 
        pic.height  = 150 
        pic.width = 150
        mainImageDiv.appendChild(pic) 

    let captionDiv = document.createElement("div")
        captionDiv.className = "post-caption"
    let caption = document.createElement("p")
        caption.innerText = postObj.caption 
        captionDiv.appendChild(caption)
    
    let likesDiv = document.createElement('div')
        likesDiv.className = "post-likes" 
    let likeBtn = document.createElement("button") 
        likeBtn.innerText = "Like"
        // add like functionality later 
    let likes = document.createElement("p")
        likes.innerText = "n/a" 
        // change serializers so likes come attached to each post 
        likesDiv.appendChild(likeBtn) 
        likesDiv.appendChild(likes)  

    postCard.appendChild(proPicDiv)
    postCard.appendChild(mainImageDiv)
    postCard.appendChild(captionDiv)
    postCard.appendChild(likesDiv)

    chosenFollow.appendChild(postCard)

}