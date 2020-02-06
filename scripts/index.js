

function setup(){
  const subNavNode = document.createElement('ul');
  subNavNode.setAttribute('id', "subnav_wrapper");
  const subnavhtml = `
    <li id="11-harley" class="subnav"><a href="/?cat=harley-davidson&year=1911">1911 & earlier Harley Davidson</a></li>
    <li id="12-harley" class="subnav"><a href="/?cat=harley-davidson&year=1912">1912 Harley Davidson</a></li>
    <li id="13-harley" class="subnav"><a href="/?cat=harley-davidson&year=1913">1913 Harley Davidson</a></li>
    <li id="14-harley" class="subnav"><a href="/?cat=harley-davidson&year=1914">1914 Harley Davidson</a></li>
    <li id="15-harley" class="subnav"><a href="/?cat=harley-davidson&year=1915">1915 Harley Davidson</a></li>
    <li id="16-harley" class="subnav"><a href="/?cat=harley-davidson&year=1916">1916 & later Harley Davidson</a></li>
  `;
  subNavNode.innerHTML = subnavhtml
  const nav_main = document.getElementById('main_nav');
  nav_main.appendChild(subNavNode);
  const harley = document.getElementById('harley_nav');
  const subnav = document.getElementById('subnav_wrapper');
  function toggleSubNav(ev){
    ev.preventDefault();
    const subnav = document.getElementById('subnav_wrapper');
    if(subnav.style.display === "" || subnav.style.display === "none"){
      subnav.style.display = 'unset';
    } else {
      subnav.style.display = 'none';
    }
  }
  harley.addEventListener('click', toggleSubNav);
  const homeMain = document.getElementById('home_main');
  homeMain.innerHTML = "loading ...";
  Papa.parse('antique_moto_smith_main.csv',{
  download: true,
  header: true,
  complete: function(res){
    localStorage.setItem('antique_moto_data', JSON.stringify(res.data));
    render();
    }
  });
}

setup();

function render(){
  let html;

  const params = new URLSearchParams(window.location.search);
  const urlCat = params.get('cat');
  const urlProductId = params.get('product_id');
  const urlYear = params.get('year');
  if(urlProductId){
    html = utils.productPageBuilder(urlProductId);
  } else if(["harley-davidson", "seats", "tanks"].indexOf(urlCat) > -1) {
    html = utils.categoryPageBuilder(urlCat, urlYear);
  } else if (urlCat === "how_to_order"){
    html = utils.howToOrderHtml();
  } else {
    html = utils.homePageHtml();
  }
  const homeMain = document.getElementById('home_main');
  homeMain.innerHTML = html;
  utils.attachProductImageHandler();
}

