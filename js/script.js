document.addEventListener("DOMContentLoaded", function(){
//$(function() {
  // Variables
  const LIMIT = 12;
  const MY_API_KEY='BvCBQeH2bfwoKZ8Uabwe0ynMvv1yx8VZ';

  // References
  const stories = document.getElementById('stories');  
  const dropdown = document.getElementById('category');

  // Loading graphic
  const loader = document.createElement('img');
  loader.setAttribute('id', 'loader');
  loader.setAttribute('src', 'images/ajax-loader.gif');
  loader.setAttribute('style', 'display:none');
  stories.append(loader);

  // Functions
  function generateThumbs(number, array){
    // create new list
    const list = document.createElement('ul');

    for( let i=0; i < number; i++ ){
      // TO DO: only display articles that have an image, use filter...
      if(array[i].multimedia[0].url){
        const item = document.createElement('li');
        const link = document.createElement('a');
        link.setAttribute('target', '_blank');
        link.setAttribute('href', array[i].url);
        const thumb = document.createElement('div');
        thumb.setAttribute('class', 'thumb');
        thumb.setAttribute('style', `background-image:url( ${ array[i].multimedia[0].url } )`);
        link.append(thumb);
        item.append(link);
        list.append(item);
      }      
    }

    stories.append(list);
  }

  
  // Event Handlers
  dropdown.addEventListener('change', function(event){    
    // get value that it changed to
    // $selectedCategory = $(this).children('option:selected').val(); // .text() // $(this).val()
    const selectedCategory = this.value; // event.srcElement.value

    // show loading graphic
    loader.setAttribute('style', 'display:block');

    // Hide previous list before deleting it
    if( document.querySelector('ul') ) {
      let existingList = document.querySelector('ul');
      existingList.setAttribute('display', 'none');
      existingList.parentNode.removeChild(existingList);
    }
    
    // using jQuery ajax method
    $.ajax({
      method: 'GET',
      url: `https://api.nytimes.com/svc/topstories/v2/${ selectedCategory }.json?api-key=${ MY_API_KEY }` 
      // better to put key in external file
    })
    .done( function(data){
      console.log(data);

      if( data.results.length > 0 ){      
        // hide loading loop image
        loader.setAttribute('style', 'display:none');
        
        if( data.results.length > LIMIT ){
          generateThumbs( LIMIT, data.results );
        } else {
          generateThumbs( data.results.length, data.results );
        }     
      }      
    });
  });
  
  
// }); end document.ready
}); // end Javascript DOMContentLoaded wrapper