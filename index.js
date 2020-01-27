// listener on logo, loads home page builder
// when page is built, event listeners are re-attached
// home page builder, category builder, product builder
// single page with loading of category first, then load categories?
// either way, when click on a product, it expands and contracts when clicked on again
// classes define whether a category or product
// set current class and previous on localstorage?


window.onload = (e) => {
  // console.log("reached");
}

function setup(){
  const subNavNode = document.createElement('ul');
  subNavNode.setAttribute('id', "subnav_wrapper");
  const subnavhtml = `
    <li id="11-harley" class="subnav"><button>1911 & earlier Harley Davidson</button></li>
    <li id="12-harley" class="subnav"><button>1912 Harley Davidson</button></li>
    <li id="13-harley" class="subnav"><button>1913 Harley Davidson</button></li>
    <li id="14-harley" class="subnav"><button>1914 Harley Davidson</button></li>
    <li id="15-harley" class="subnav"><button>1915 Harley Davidson</button></li>
    <li id="16-harley" class="subnav"><button>1916 & later Harley Davidson</button></li>
  `;
  subNavNode.innerHTML = subnavhtml
  const nav_main = document.getElementById('main_nav');
  nav_main.appendChild(subNavNode);
  const harley = document.getElementById('harley_nav');
  const subnav = document.getElementById('subnav_wrapper');
  function toggleSubNav(ev){
    ev.preventDefault();
    const subnav = document.getElementById('subnav_wrapper');
    console.log(subnav.style);
    if(subnav.style.display === "" || subnav.style.display === "none"){
      subnav.style.display = 'unset';
    } else {
      subnav.style.display = 'none';
    }
  }
  harley.addEventListener('click', toggleSubNav);

  let curTime = new Date().getTime();
  const oneDay = 1000 * 24 * 60 * 60;
  const aDayOld = curTime - oneDay;
  let curDataTime = JSON.parse(localStorage.getItem('antique_moto_data_time'));
  if(!curDataTime || curDataTime > aDayOld){
    Papa.parse('antique_moto_smith_main.csv',{
    download: true,
    header: true,
    complete: function(res){
      let data = res.data;
      localStorage.setItem('antique_moto_data', JSON.stringify(data));
      localStorage.setItem('antique_moto_data_time', JSON.stringify(curTime));
      // homePageBuilder(data);
      // const main_nav = document.getElementById('main_nav');
      // main_nav.onclick = function(event){
      //   event.preventDefault();
      //   console.log('reached');
      //   let curtarg = event.target.closest('li').id;
      //   console.log(curtarg);
      //   categoryPageBuilder(data, curtarg)
      // }
      }
    });
  }

  nav_main.addEventListener('click', categoryPageBuilder)
  function setCategory(cat){
    if(cat === 'seats' || cat === 'tanks'){
      return {cat: cat, year: 100};
    }
    return {cat: 'harley', year:cat.slice(0,2) }
  }

  function categoryPageBuilder(event){
    let catId = event.target.closest('li').id;
    if(catId !== 'harley_nav'){
      let curCat = setCategory(catId);
      let html = "";
      let data = JSON.parse(localStorage.getItem('antique_moto_data'));
      let cat = data.filter(elem => {
        if (!elem.years) {
          elem.years = [100];
        }
        return elem.category.toLowerCase() === curCat.cat.toLowerCase() &&
        elem.years.includes(curCat.year);
      });
      cat.forEach(elem => {
        html +=
        `
        <div id="${elem.category}" class="category_item">
          <a href="./category/${elem.product_description}/products.html">
            <div class="item_group_wrapper">
              <div class="category_img">
                <div class="img_wrapper">
                  <img class="image_test" src="${elem.main_image}">
                </div>
              </div>
            </div>
          </a>
        </div>
        `
      });
      const homeMain = document.getElementById('home_main');
      homeMain.innerHTML = html;
    }
  }
}

setup();


// {
//   category: 'seats',
//   years: [11,12,13,14,15], //optional
//   main_image: "products/seats/this_seat.jpg",
//   additional_images: ['detail_one.jpg','detail_two.jpg'], //optional
//   product_name: "mesinger happy",
//   part_number: "", //optional
//   product_description: "", //optional
//   price: 150 //in product description have inquire and replace with price if applicable

// }


  // function homePageBuilder(data){
  //   let home = "";
  //   const homeMain = document.getElementById('home_main');
  //   let homeElems = data.filter(elem => elem.category === "home")
  //   homeElems.forEach(elem => {
  //     home +=
  //       `<div id="${elem.product_description}" class="element_wrapper">
  //         <a href="./category/${elem.product_description}/products.html">
  //           <div class="item_group_wrapper">
  //             <div class="category_img">
  //               <div class="img_wrapper">
  //                 <img class="image_test" src="${elem.main_image}">
  //               </div>
  //               <h1 class="category_img_desc">${elem.product_description}</h1>
  //             </div>
  //           </div>
  //         </a>
  //         </div>
  //       `;
  //   })
  //   homeMain.innerHTML = home;
  // }


          // <div class="category_desc">
          //   <p>
          //     lorem ipsum lorem ipsum lorem ipsum lorem ipsum
          //     lorem ipsum lorem ipsum lorem ipsum lorem ipsum
          //     lorem ipsum lorem ipsum lorem ipsum lorem ipsum
          //   </p>
          // </div>
