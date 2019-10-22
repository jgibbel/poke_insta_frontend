let selects = document.querySelector(".pokemon-dropdown-select")
let pokemonProfile = document.querySelector('.profile-container')
let pokemonProfCard = pokemonProfile.querySelector('.profile-card')
let myPostsDiv = pokemonProfile.querySelector('.my-posts')
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
        removeChildren(pokemonProfCard)
        removeChildren(myPostsDiv)
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
        profileCard.className = 'card'
        profileCard.style.width = '18rem'

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
            profilePic.className = 'card-img-top'
            profilePic.src = `${obj.image}`
            profilePic.alt = `${obj.species}-pic`
            // profilePic.height = '100'
            // profilePic.width = '100'

        let formContainer = document.createElement('div')
            formContainer.className = 'form-container'

            let createPostForm = document.createElement('form')
                createPostForm.className = 'create-post-form'

                let formHeader = document.createElement('h3')
                    formHeader.innerText = 'New Post'

                let captionInput = document.createElement('input')
                    captionInput.name = 'caption'
                    captionInput.type = 'text'
                    captionInput.value = ""
                    captionInput.placeholder = "Caption..."
                    captionInput.className = "input-text"
                
                let br = document.createElement('br')

                let imageInput = document.createElement('input')
                    imageInput.name = 'image'
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
            createPostForm.addEventListener('submit', evt => {
                evt.preventDefault()
                submitNewPost(evt, obj)
            })

        formContainer.append(createPostForm)

        let toggleForm = document.createElement('p')
            // toggleForm.style = 'text-align: center'
            toggleForm.innerText = '+ Post'
            toggleForm.addEventListener('click', evt => {
                formDisplay(toggleForm)
            })

        let profilePostsContainer = document.createElement('div')
            profilePostsContainer.className = 'pokemon-posts-container'

        obj.posts.forEach(post => {
            let postCard = makePostCard(post, obj)

                let deleteBtn = document.createElement('button')
                    deleteBtn.className = 'delete-post'
                    deleteBtn.innerText = 'Delete Post'
                    deleteBtn.addEventListener('click', evt => {  
                        postCard.remove()
                        deletePost(post)
                    })
            
            postCard.append(deleteBtn)
            myPostsDiv.append(postCard)
        })

    profileCard.append(profileName, followerCount, profilePic, formContainer, toggleForm, profilePostsContainer)
    pokemonProfCard.prepend(profileCard)
}

function deletePost(post){
    // console.log(post)
    fetch(`http://localhost:3000/posts/${post.id}`, {
        method: 'DELETE'
    })
    .then(resp => resp.json())
    .then(respJSON => {
        console.log(respJSON)
    })
}

function submitNewPost(evt, obj){
    console.log(obj)
    let newCaption = evt.target.caption.value
    let newImage = evt.target.image.value
    fetch('http://localhost:3000/posts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            image: newImage,
            caption: newCaption,
            pokemon_id: obj.id
        })
    })
    .then(resp => resp.json())
    .then(respJSON => {
        console.log(respJSON)
        let newPost = makePostCard(respJSON, obj)
        myPostsDiv.prepend(newPost)
    })
}

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
                followingOption.innerText = following.species
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
        let postCard = makePostCard(post, obj)
        chosenFollow.append(postCard)
    })
}


function makePostCard(postObj, parentObj) {
    let postCard = document.createElement('div')
        postCard.className = "post-card card"
        postCard.style.width = '18rem'

        let proPicDiv = document.createElement('div')
            proPicDiv.className = "profile-link"

            let propic = document.createElement("img") 
                propic.src = parentObj.image
                propic.alt = "Profile Thumbnail" 
                propic.height  = 25 
                propic.width = 25 

            let profileN = document.createElement('span')
                profileN.className = 'profile-icon-name'
                profileN.innerText = parentObj.species

        proPicDiv.append(propic, profileN) 
        
        let mainImageDiv = document.createElement('div')
            mainImageDiv.className = "post-image"

            let pic = document.createElement("img") 
                pic.className = 'card-img-top'
                pic.src = postObj.image 
                pic.alt = "Image File" 
                // pic.height  = 160 
                // pic.width = 135

        mainImageDiv.appendChild(pic) 

        let captionDiv = document.createElement("div")
            captionDiv.className = "post-caption card-body"

            let caption = document.createElement("p")
                caption.className = 'card-text'
                caption.innerText = postObj.caption 

        captionDiv.appendChild(caption)
        
        let likesDiv = document.createElement('div')
            likesDiv.className = "post-likes" 

            let likeBtn = document.createElement("button") 
                likeBtn.className = 'btn btn-primary'
                likeBtn.innerText = "Like"
                
                let likes = document.createElement("p")
                    likes.innerHTML = ' likes'

                    let likes_count = document.createElement('span')
                        likes_count.innerText = postObj.likes_count 
                        likes.prepend(likes_count)

                    likeBtn.addEventListener('click', evt => {
                        likes_count.innerText = parseInt(likes_count.innerText) +  1
                        addLike(postObj)
                    })

        likesDiv.append(likeBtn, likes)  

    postCard.append(proPicDiv, mainImageDiv, captionDiv, likesDiv)

    return postCard
}

function addLike(obj){
    let pokemon_id = obj.pokemon_id
    let post_id = obj.id
    fetch('http://localhost:3000/likes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            post_id: post_id,
            pokemon_id: pokemon_id
        })
    })
}