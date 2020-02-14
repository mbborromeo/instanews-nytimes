document.addEventListener("DOMContentLoaded", function(){
//$(function() {
  // Variables
  const LIMIT = 12;
  const MY_API_KEY='BvCBQeH2bfwoKZ8Uabwe0ynMvv1yx8VZ'; // better to put key in external file

  // References
  const stories = document.getElementById('stories');  
  const dropdown = document.getElementById('category');
  const header = document.getElementsByTagName('header')[0];  

  // Loading graphic
  const loader = document.createElement('img');
  loader.setAttribute('id', 'loader');
  loader.setAttribute('src', 'images/ajax-loader.gif');
  loader.setAttribute('alt', 'Content loading...');
  loader.setAttribute('style', 'display:none');
  stories.append(loader);

  // Functions
  function generateThumbs(array){
    // create new list
    const ul = document.createElement('ul');

    for( let i=0; i < array.length; i++ ){
      const li = document.createElement('li');

      const a = document.createElement('a');
      a.setAttribute('target', '_blank');
      a.setAttribute('href', array[i].url);

      const figure = document.createElement('figure');

      const image = document.createElement('img');
      image.setAttribute('src', array[i].multimedia[0].url);

      const figcaption = document.createElement('figcaption');      

      const h2 = document.createElement('h2');
      h2.innerText = array[i].title;

      // add title as well
      figcaption.append(h2);
      //figcaption.innerText = array[i].abstract; 
      figcaption.append( array[i].abstract );     

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
    })
    .done( function(data){
      if( data.results.length > 0 ){
        // filter out articles that don't have images, and only get the first 12 items
        //const articleWithImagesArray = []; does not work, but let does
        const articleWithImagesArray = data.results
          .filter( item => item.multimedia && item.multimedia.length && item.multimedia[0].url )
          .slice(0, LIMIT);   

        // hide loading loop image
        loader.setAttribute('style', 'display:none');
        
        generateThumbs( articleWithImagesArray );
      } else {
        stories.innerText = 'No articles returned for category ' + selectedCategory;
      }
    })
    .fail( function() {
      alert('error with API call');
    });
  });
  
// }); end document.ready
}); // end Javascript DOMContentLoaded wrapper
