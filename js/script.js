// Wait until DOM has loaded
document.addEventListener('DOMContentLoaded', function(){
  // Declare Variables
  const LIMIT = 12;
  const MY_API_KEY='BvCBQeH2bfwoKZ8Uabwe0ynMvv1yx8VZ'; // in future, put key in external file

  // DOM References
  const stories = document.getElementById('stories');  
  const dropdown = document.getElementById('category');
  const header = document.getElementsByTagName('header')[0];  
  const loader = document.getElementById('loader');  

  // Function Declarations  
  function hideLoader(){
    stories.classList.remove('loading');
    loader.setAttribute('style', 'display:none');
  }

  function showLoader() {
    stories.classList.add('loading');
    loader.setAttribute('style', 'display:flex');  
  }

  function checkAllImagesLoaded( listOfImages ){
    let allImagesLoaded = true;
    const builtImages = listOfImages.getElementsByTagName('img');

    for( let i=0; i < builtImages.length; i++ ){
      if( builtImages[i].hasAttribute('data-loaded')!==true ){ // && image.getAttribute('data-loaded')!=='true'
        //console.log('image not loaded', i)
        allImagesLoaded = false;
        return false; // return false, exit for-loop
      }
    }

    return allImagesLoaded;
  }

  function fadeInImages() {
    // lookup all list items
    const builtUL = document.getElementsByTagName('ul')[0]; // this.parentNode.parentNode.parentNode
    
    if( checkAllImagesLoaded(builtUL) ){
      hideLoader();

      // show ul
      builtUL.classList.add('show');
  
      // fade in images
      const builtListItems = builtUL.getElementsByTagName('li');
      for( let i=0; i < builtListItems.length; i++ ){  
        // $(item).delay( i * 150 ).animate( {opacity: 1}, 250 );
        setTimeout( function(){
            builtListItems[i].classList.add('show');
          }, 
          i * 150 
        );        
      }
    }
  }
  
  function buildThumbnails(array){
    const ul = document.createElement('ul');

    array.forEach( (item, i) => { 
      const li = document.createElement('li');

      const a = document.createElement('a');
      a.setAttribute('href', item.url);      
      a.setAttribute('target', '_blank');

      const figure = document.createElement('figure');

      const image = document.createElement('img');
      image.setAttribute('alt', 'Image '+ i);
      image.setAttribute('src', item.multimedia[0].url);
      image.onload = function(){
        //console.log('image has loaded!', i);
        this.setAttribute('data-loaded', 'true');
        fadeInImages();
      };

      const figcaption = document.createElement('figcaption');      

      const h2 = document.createElement('h2');
      h2.innerText = item.title;

      const paragraph = document.createElement('p');
      paragraph.innerText = item.abstract;

      figcaption.append(h2);
      figcaption.append(paragraph);     

      figure.append(image);
      figure.append(figcaption);

      a.append(figure);
      li.append(a);
      ul.append(li);
    });

    // append dynamically generated ul to DOM
    stories.append(ul);
  }
  
  // Event Handlers
  dropdown.addEventListener('change', function(event){
    // get value of dropdown on change
    const selectedCategory = this.value; // event.srcElement.value, $(this).children('option:selected').val(), .text()

    // set height for header and stories
    header.classList.add('shrink');
    stories.classList.add('expand');

    // remove previous list
    let existingUL = document.querySelector('ul');
    if( existingUL !== null ) {    
      existingUL.parentNode.removeChild(existingUL);
    }

    // show loading graphic 
    showLoader();
    
    // using jQuery ajax method
    $.ajax({
      method: 'GET',
      url: `https://api.nytimes.com/svc/topstories/v2/${ selectedCategory }.json?api-key=${ MY_API_KEY }`
      // url: 'https://api.nytimes.com/svc/topstories/v2/'+ selectedCategory +'.json?api-key='+ MY_API_KEY
    })
    .done( function(data){
      // Proceed only if there are any results
      if( data.status==='OK' && data.results && data.results.length > 0 ){
        // Filter out articles that don't have images, and only get the first 12 items
        const articlesWithImagesArray = 
          data.results
            .filter( item => item.multimedia && item.multimedia.length && item.multimedia[0].url )
            .slice(0, LIMIT);   
        
        buildThumbnails( articlesWithImagesArray );
      } else {
        hideLoader();
        stories.innerText = 'No articles returned for category ' + selectedCategory;
      }
    })
    .fail( function() {
      hideLoader();
      stories.innerText = 'Error - failed to load articles for category ' + selectedCategory;
    });
  });
  
}); // end Javascript DOMContentLoaded wrapper
