document.addEventListener("DOMContentLoaded", function(){
//$(function() {
  // Variables
  const LIMIT = 12;
  const MY_API_KEY='BvCBQeH2bfwoKZ8Uabwe0ynMvv1yx8VZ';

  // References
  const stories = document.getElementById('stories');  
  const dropdown = document.getElementById('category');
  const header = document.getElementsByTagName('header')[0];  

  // Loading graphic
  const loader = document.createElement('img');
  loader.setAttribute('id', 'loader');
  loader.setAttribute('src', 'images/ajax-loader.gif');
  loader.setAttribute('style', 'display:none');
  stories.append(loader);

  // Functions
  function generateThumbs(array, number){
    // create new list
    const ul = document.createElement('ul');

    for( let i=0; i < number; i++ ){
      const li = document.createElement('li');

      const a = document.createElement('a');
      a.setAttribute('target', '_blank');
      a.setAttribute('href', array[i].url);

      const figure = document.createElement('figure');

      const image = document.createElement('img');
      image.setAttribute('src', array[i].multimedia[0].url);

      const figcaption = document.createElement('figcaption');
      figcaption.innerText = array[i].abstract; // can add title as well

      figure.append(image);
      figure.append(figcaption);

      a.append(figure);
      li.append(a);
      ul.append(li);
    }

    stories.append(ul);
  }

  
  // Event Handlers
  dropdown.addEventListener('change', function(event){    
    // get value that it changed to
    // $selectedCategory = $(this).children('option:selected').val(); // .text() // $(this).val()
    const selectedCategory = this.value; // event.srcElement.value

    // Set height for header and stories
    header.setAttribute('class', 'shrink');
    stories.setAttribute('class', 'expand');

    // show loading graphic
    loader.setAttribute('style', 'display:block');

    // Hide previous list before deleting it
    if( document.querySelector('ul') ) {
      let existingUL = document.querySelector('ul');
      existingUL.setAttribute('display', 'none');
      existingUL.parentNode.removeChild(existingUL);
    }
    
    // using jQuery ajax method
    $.ajax({
      method: 'GET',
      url: `https://api.nytimes.com/svc/topstories/v2/${ selectedCategory }.json?api-key=${ MY_API_KEY }` 
      // better to put key in external file
    })
    .done( function(data){
      if( data.results.length > 0 ){    
        //console.log(data);

        // filter out articles that don't have images    
        //const articleWithImagesArray = []; does not work
        //let articleWithImagesArray = []; works
        const articleWithImagesArray = data.results.filter( item => item.multimedia && item.multimedia.length && item.multimedia[0].url );

        // hide loading loop image
        loader.setAttribute('style', 'display:none');
        
        if( articleWithImagesArray.length > LIMIT ){
          generateThumbs( articleWithImagesArray, LIMIT );
        } else {
          generateThumbs( articleWithImagesArray, articleWithImagesArray.length );
        }     
      }      
    })
    .fail( function() {
      alert('error with API call');
    });
  });
  
  
// }); end document.ready
}); // end Javascript DOMContentLoaded wrapper