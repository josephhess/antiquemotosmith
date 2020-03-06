
const utils = {
  prepData: function (data, category, year){
    let filteredByCategory = data.filter(elem => elem.category.toLowerCase() === category.toLowerCase());
    if(category === 'harley-davidson' && year){
      let filteredByYear = filteredByCategory.filter(elem => elem.years.includes(year))
      return {category: category, data: filteredByYear};
    }
    return {category: category, data: filteredByCategory};
  },

  forMatData: function (dataSet){
    let results = {category: dataSet.category, subcategories: {}};
    let other = [];
    dataSet.data.forEach(elem => {
      if (results.subcategories.hasOwnProperty(elem.subcategory)){
        results.subcategories[elem.subcategory].push(elem)
      } else {
        if(elem.subcategory === ""){
          other.push(elem);
        } else {
          results.subcategories[elem.subcategory] = [];
          results.subcategories[elem.subcategory].push(elem);
        }
      }
    })
    if (other.length > 0) {
      results.subcategories['other'] = other;
    }
    return results;
  },

  formatCategoryHtml: function(dataSet, category, year){
    function yearString(year){
      switch(year){
        case "1911": return "1911 & Earlier";
        case "1916": return "1916 & Later";
        case null: return "";
        default: return year;
      }
    }
    let formattedHtml = `<h2 class="category_heading">${yearString(year)} ${category}</h2>`;
    Object.entries(dataSet.subcategories).forEach(subcat => {
      formattedHtml += this.formatSubcategoryHtml(subcat);
    })
    return formattedHtml;
  },

  formatSubcategoryHtml: function(subcat){
    let subCatFormatted = `
     <div class="subcategory_heading">
          <h3>${subcat[0]}</h3>
      </div>
      <div class="subcategory">
       `;
    subcat[1].forEach(item => {
        subCatFormatted += `
        <div id="${item.id}" class="category_item">
          <a href="/?product_id=${item.id}&product_name=${item.product_name.replace(/\s+/g, "-")}">
            <div class="item_group_wrapper">
              <div class="category_img">
                <div class="img_wrapper">
                  <img class="image_style" src="${item.thumbs}">

                    <div class="item_short_desc">
                      ${item.product_name}
                    </div>

                </div>
              </div>
            </div>
          </a>
        </div>
        `})
    subCatFormatted += "</div>"
    return subCatFormatted;
  },

  categoryPageBuilder: function(catId, year){
    if(catId !== 'harley_nav' || catId !== 'home'){
      let data = JSON.parse(localStorage.getItem('antique_moto_data'));
      let filteredData = utils.prepData(data, catId, year );
      let formattedData = utils.forMatData(filteredData);
      let html = utils.formatCategoryHtml(formattedData, catId, year);
      return html;
    }
  },

  productPageBuilder: function(product_id){
    let data = JSON.parse(localStorage.getItem('antique_moto_data'));
    let productData = data.find(elem => elem.id === product_id);
    let additional_imageshtml = "";

    if (productData.additional_images && productData.additional_images.length > 0){
    let additional_images = JSON.parse(productData.additional_images);
      additional_imageshtml += `<div class="additional_images">`;
      additional_images.forEach(img => {
        additional_imageshtml += `
          <div class="img_wrapper">
            <img class="image_style" src="${img}" alt="additional_image of ${productData.product_name}">
          </div>
        `
      });
      additional_imageshtml += "</div>";
    }
    const url = encodeURIComponent(document.URL);
    let html =`
      <div id="product_full">
        <div class="product_group_wrapper">
            <div class="category_img">
              <div class="img_wrapper">
                <img alt="${productData.product_name}" class="image_style" src="${productData.main_image}">
              </div>
            </div>
            <div class="product_details">
              <p class="product_name">Item: ${productData.product_name}</p>
              <p class="product_price">Price: ${productData.price}</p>
              <p class="product_part_number">Part#:  ${productData.id}</p>
              <p class="product_description">Details: ${productData.product_description}</p>
              <div>
                <a  class="how-to-order-btn" href="/?cat=how_to_order">How To Order</a>
                <div class="social_block">
                  <a class="social-share-btn fb" href="#" target="_blank"
                    onclick="window.open('https://www.facebook.com/sharer/sharer.php?u=${url}&t=${url}', 'targetWindow', 'location=0,status=no,menubar=no,scrollbars=yes,resizable=yes,width=600,height=250');
                    return false;">
                    <i class="fab fa-facebook"></i>Share
                  </a>
                  <a class="social-share-btn twitter" target="_blank" href="//twitter.com/share?text=Antique Moto Smith: ${productData.product_name}&url=${url}" class="share-twitter" title="Tweet on Twitter">
                    <span class="share-title"><i class="fab fa-twitter"></i>Tweet</span>
                  </a>
                  <a class="social-share-btn pinterest"target="_blank" href="//pinterest.com/pin/create/button/?url=${window.location.href}&media=${window.location.origin}${productData.main_image.slice(1)}&description=${productData.product_name}" class="share-pinterest" title="Pin on Pinterest">
                    <span class="share-title" aria-hidden="true"><i class="fab fa-pinterest"></i>Pin it</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
          ${additional_imageshtml}
      </div>
      <div id="myModal" class="modal">
        <span class="close">&times;</span>
        <img class="modal-content" id="imgO1" alt="expanded version of ${productData.product_name}">
        <div id="caption"></div>
      </div>`;
    return html;
  },

  homePageHtml: function(){
    return ` <div class="item_group_wrapper">
        <div class="category_img">
          <div class="img_wrapper">
            <img class="image_style" src="./12_harley_main.jpg" alt="image of a 1912 harley davidson motorcycle">
          </div>
        </div>
      </div>`
  },

  howToOrderHtml: function (){
    return `
              <div class="how_to_order">
              <h2 class="bold">How To Order: </h2>

              <h4>Please copy and paste the following into an email and complete:</h4>
              <ul class="order_paste_list">
                <li>product number(s): </li>
                <li>product name(s):</li>
                <li>quantities:</li>
                <li>first and last name:</li>
                <li>shipping address:</li>
                <li>phone number(optional):</li>
              </ul>
                <p>Or click  <a target="blank" href="mailto:antiquemotosmith@gmail.com?subject=parts%20inquiry&body=Hello%2C%20I%20am%20inquiring%20about%20the%20following%20parts%3A%0A%0Aproduct%20number(s)%3A%0Aproduct%20name(s)%3A%0Aquantities%3A%0Afirst%20and%20last%20name%3A%0Ashipping%20address%3A%0Aphone%20number(optional)%3A%0A%0AThanks%2C">HERE</a> to have your email open automatically with the info ready to fill out!</p>
                <p class="product_name">
                We will respond as quickly as possible with availability and total cost.</p>

                 <p>Once we have confirmed the parts available you can pay by either check to:</p>
                 <p class="bold">32850 S Adams Cemetery Rd. Mollala Or. 97038</p>
                 or through Venmo:</p>

                <p> Venmo tranfers are free if you use debit card or bank acct. If you dont have a Venmo account click here to sign up:
                <a href="https://venmo.com/signup">Venmo Sign Up</a>
                <p>
              </div>
              `
  },

  attachProductImageHandler: function(){
    const modal = document.getElementById("myModal");
    const productFull = document.getElementById("product_full");
    const modalImg = document.getElementById("imgO1");
    const captionText = document.getElementById("caption");

    if(productFull){
      productFull.addEventListener('click', function(event){
      const currentImage = event.target;
        if(event.target.src){
          modal.style.display = "block";
          modalImg.src = currentImage.src;
          captionText.innerHTML = currentImage.alt;
        }
      });
      const span = document.getElementsByClassName("close")[0];
      span.addEventListener("click", function(event){
        modal.style.display = "none";
      });
    }
  }
}

