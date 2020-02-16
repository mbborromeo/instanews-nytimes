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
  function buildThumbnails(array){
    const ul = document.createElement('ul');

    // array.forEach( function(item, i) { 
    //    ...
    // });
    for( let i=0; i < array.length; i++ ){
      const li = document.createElement('li');

      const a = document.createElement('a');
      a.setAttribute('href', array[i].url);      
      a.setAttribute('target', '_blank');

      const figure = document.createElement('figure');

      const image = document.createElement('img');
      image.setAttribute('src', array[i].multimedia[0].url);
      image.setAttribute('alt', 'Image '+ i);

      const figcaption = document.createElement('figcaption');      

      const h2 = document.createElement('h2');
      h2.innerText = array[i].title;

      const paragraph = document.createElement('p');
      paragraph.innerText = array[i].abstract;

      figcaption.append(h2);
      figcaption.append(paragraph);     

      figure.append(image);
      figure.append(figcaption);

      a.append(figure);
      li.append(a);
      ul.append(li);
    }

    // hide loading loop image
    loader.setAttribute('style', 'display:none');

    // show dynamically generated ul
    stories.append(ul);
  }
  
  // Event Handlers
  dropdown.addEventListener('change', function(event){    
    console.log('change dropdown');

    // get value of dropdown on change
    const selectedCategory = this.value; // event.srcElement.value, $(this).children('option:selected').val(), .text()

    // set height for header and stories
    header.setAttribute('class', 'shrink');
    stories.setAttribute('class', 'expand');

    // remove previous list
    let existingUL = document.querySelector('ul');
    if( existingUL !== null ) {    
      existingUL.parentNode.removeChild(existingUL);
    }

    // show loading graphic
    loader.setAttribute('style', 'display:flex');    
    
    // using jQuery ajax method
    $.ajax({
      method: 'GET',
      url: `https://api.nytimes.com/svc/topstories/v2/${ selectedCategory }.json?api-key=${ MY_API_KEY }`
      // url: 'https://api.nytimes.com/svc/topstories/v2/'+ selectedCategory +'.json?api-key='+ MY_API_KEY
    })
    .done( function(data){
      console.log(data)
      // Proceed only if there are any results
      if( data.results.length > 0 ){
        // Filter out articles that don't have images, and only get the first 12 items
        const articlesWithImagesArray = 
          data.results
            .filter( item => item.multimedia && item.multimedia.length && item.multimedia[0].url )
            // .filter( function(item) { return (item.multimedia && item.multimedia.length && item.multimedia[0].url); } )
            // .filter( function(item) { 
            //   if (item.multimedia && item.multimedia.length && item.multimedia[0].url) { 
            //     return true; 
            //   } else {
            //     return false;
            //   }
            // })
            .slice(0, LIMIT);   
        
        buildThumbnails( articlesWithImagesArray );
      } else {
        stories.innerText = 'No articles returned for category ' + selectedCategory;
      }
    })
    .fail( function() {
      alert('error with API call');
    });
  });
  
}); // end Javascript DOMContentLoaded wrapper
