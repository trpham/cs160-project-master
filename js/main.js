$(document).ready(function() {

  var categories = ["Category1", "Category2", "Category3", "Category4"]
  var articles = {} // { Category: [article] }
  var sources = {}
  var articlesRead = []  // [article]
  var biasAverage = 0.0
  var selectedCategory = "" // Current selected category
  var selectedArticleIndex = -1  // Current selected article index in articles
  
  // Fetch data from local json files
  $.ajax({
    url:'files/articles.json',
    dataType: 'json',
    type: 'get',
    cache: 'true',
    success: function(data) {
      $(data.articles).each(function(index, article) {
        // Initialize article list
        if (!articles.hasOwnProperty(article.category)) {
          articles[article.category] = [];
        }
        articles[article.category].push(article)
      });
    }
  }),

  $.ajax({
    url:'files/user.json',
    dataType: 'json',
    type: 'get',
    cache: 'true',
    success: function(user) {
      biasAverage = user.biasAverage
      articlesRead = user.articlesRead
    }
  }),

  $.ajax({
    url:'files/sources.json',
    dataType: 'json',
    type: 'get',
    cache: 'true',
    success: function(data) {
      sources = data.sources
    }
  })

  
  $(".category-nav").click(function(event) {

    // Get the category
    selectedCategory = $(event.target).text();

    // Clear any innerHTML inside #articles-container
    $("#articles-container").empty();

    // Append category name
    $("#articles-container").append('<div><h3>' + selectedCategory +  '</h3></div>');

    // Append articles data
    $.each(articles[selectedCategory], function(index, article) {
      $("#articles-container").append(
        '<a class="article" href="' + article.url + '" target="_blank">' +
          '<div class="row">' +   
              '<p>' + article.title + '</p>' + 
              '<p>' + article.source + '</p>' +
              '<p>' + article.content + '</p>' +
              '<p>' + article.date + '</p>' +
              '<img src="' + article.imageURL + '" width="200">' +
          '</div>' +
        '</a>'
      );
    });
  });

  // Index of clicked article is equivalent to the index of the <a> tag child under #articles-container
  $("#articles-container").on("click", "a", function() {
    selectedArticleIndex = $(this).index() - 1 // Array starts at 0
    selectedArticle = articles[selectedCategory][selectedArticleIndex]
    articlesRead.push(selectedArticle)
    // console.log(articlesRead)
    // console.log(calcuateBiasAverage(articlesRead, sources))
  });

});

// Helper method to calcuate bias average
function calcuateBiasAverage(articlesRead, sources) {

  var sum = 0;

  if (articlesRead.length > 0) {
    articlesRead.forEach(function(article, index) {
      sum += sources[article.source]
    });
    return (sum / articlesRead.length);
  }

  return sum
}




