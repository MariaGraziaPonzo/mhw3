function onResponse(response){
  if(!response.ok){
      console.log('Risposta non valida');
      return null;
  }else{
      console.log('Risposta ricevuta');
      return response.json();
  }
}

function onFail(fail){
  console.log('Errore: ' + fail);
}

function onJsonWeather(json){
  console.log("ho ricevuto" + json);
  const results = json[0];
  console.log(results);

  const weather= document.querySelector("#weather");
  weather.innerHTML='';

  const h1= document.createElement('h1');
  h1.textContent= "Catania";

  const p1=document.createElement('p');
  p1.textContent=results.Temperature.Metric.Value + "°C";
  const p= document.createElement('p');
  p.textContent= results.WeatherText;

  const image= document.createElement('img');
  if(results.HasPrecipitation===true){
    image.src="pioggia.png";
  }else{
    image.src="sole.png";
  }

  weather.appendChild(h1);
  weather.appendChild(p1);
  weather.appendChild(p);
  weather.appendChild(image);
}

function onJsonImage(json){
  const imgs = json.hits;
  const str = "div[data-index='" + index + "']";
  const box= document.querySelector(str);
  for(const img of imgs){
    const image = document.createElement('img');
    image.src= img.webformatURL;
    box.appendChild(image);
  }
}

function onJsonRecipe(json){
  console.log('json ricevuto');
  console.log(json);
  
  const form= document.querySelector("form");
  const div=document.createElement('div');
  div.classList.add('show_ricette');
  form.appendChild(div);
  const ricetta = document.querySelector('.show_ricette');
  ricetta.innerHTML = '';
  
  const results = json.hits;
  const num_results = results.length;
  for(let i=0; i<num_results; i++){
      const recipe_data = results[i];
      const titolo = recipe_data.recipe.label;
      const immagine = recipe_data.recipe.image;
      const recipe = document.createElement('div');
      recipe.classList.add('ric');
      const img = document.createElement('img');
      img.src = immagine;
      const caption = document.createElement('span');
      caption.textContent = titolo;
      recipe.appendChild(caption);
      recipe.appendChild(img);
      const ingredienti = recipe_data.recipe.ingredientLines;
      const num_ingredienti = ingredienti.length;
      for(let j=0; j<num_ingredienti; j++){
          const ingr = ingredienti[j];
          const caption_ingr = document.createElement('p');
          caption_ingr.textContent = ingr;
          recipe.appendChild(caption_ingr);
      }
      ricetta.appendChild(recipe);
  }
}

function api_pixabay(event){
  event.currentTarget.textContent= "HIDE IMAGES";
  const div_images= event.currentTarget.parentNode.querySelector('.images_hidden');
  div_images.classList.remove('images_hidden');
  div_images.classList.add('show_images');
  event.currentTarget.removeEventListener('click',api_pixabay);
  event.currentTarget.addEventListener('click',chiudi_images_box);
  const stringa_fetch = "https://pixabay.com/api/?key=" + api_key1 + "&q=" + div_images.dataset.keyword + "&category=nature"+ "&per_page=9";
  index=div_images.dataset.index;
  fetch(stringa_fetch).then(onResponse, onFail).then(onJsonImage);

}

function search(event){
  event.preventDefault();
  event.currentTarget.textContent= "RIPRISTINA PAGINA";
  const ricetta_input = document.querySelector('#ricetta');
  const ricetta_value = encodeURIComponent(ricetta_input.value);
  console.log('Eseguo ricerca: ' + ricetta_value);
  rest_url = 'https://api.edamam.com/search?q=' + ricetta_value + '&app_id=' + api_id + '&app_key=' + api_key;
  console.log('URL: ' + rest_url);
  event.currentTarget.removeEventListener('click',search);
  event.currentTarget.addEventListener('click',chiudi_recipe_box);
  fetch(rest_url).then(onResponse, onFail).then(onJsonRecipe);
}

function chiudi_images_box(event){
  event.currentTarget.textContent= "GET MORE IMAGES";
  const div_images= event.currentTarget.parentNode.querySelector('.show_images');
  div_images.innerHTML="";
  div_images.classList.remove('show_images');
  div_images.classList.add('images_hidden');
  event.currentTarget.removeEventListener('click',chiudi_images_box);
  event.currentTarget.addEventListener('click',api_pixabay);
}

function chiudi_recipe_box(event){
  event.currentTarget.textContent= "cerca";
  event.currentTarget.removeEventListener('click',chiudi_recipe_box);
  event.currentTarget.addEventListener('click',search);
  const div_ricettee= document.querySelector('.show_ricette div');
  // div_ricettee.innerHTML="";
   // div_ricettee.classList.remove('show_ricette');  
   div_ricettee.removeChild(article.lastElementChild);  
}

const weather_endpoint="http://dataservice.accuweather.com/currentconditions/v1/215605"; //215605 codice Catania
const weather_key= "tSgpD604FuWGVQ03gC5vYPVFAdRZpIRh";
let index;
let token;
const api_key1 = '35563072-13a0b8de05901b512d78537d1';
//ricette
const api_key = 'f9bafba7374f557d2a868d7d16982d34';
const api_id = '7a639f7f';

const weather_request = weather_endpoint + '?apikey=' + weather_key+ "&language="+ "it" + "&details=true";

fetch(weather_request).then(onResponse, onFail).then(onJsonWeather);
const tasti = document.querySelectorAll(".api_pixabay");
for(let tasto of tasti){
    tasto.addEventListener('click',api_pixabay);
}


const bottoni =document.querySelectorAll(".cerca");
for (let bottone of bottoni){
  bottone.addEventListener('click', search);
}


