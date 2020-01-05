module.exports = {


  getPageHTML: function(pageData) {
    console.log(pageData.title);

    return `<html>
    <head>
        ${appMetaTags(pageData)}
        ${appStyles()}
    </head>
    <body class="page-outer-container">
      <div class="page-text-container">
        <h3>${pageData.title}</h3>
        <div class="page-main-image-container">
          <img src="${pageData.image}" class="page-main-image"/>
        </div>
        <div class="page-summary-container">
          ${decodeURI(pageData.summary)}
          <div>
            ${pageTags(pageData.keywords)}
          </div>
        </div>
        <div className="h3">Full Text</div>
        <div class="page-full-text-container">
          ${decodeURI(pageData.full_text)}
        </div>
      </div>
    </body>  
    </html>`
  }
}

function appMetaTags(pageData) {
  return `
<title>${pageData.title}</title>
<meta property="og:title" content="${pageData.title}" />
<meta property="og:type" content="article" />
<meta property="og:image" content="${pageData.image}" />  
  `;
}

function pageTags(keywords) {
  return keywords.map((key) => (
    `<div class="key-chip">${key}</div>`
  )).join(" ")
}

function appStyles() {
  return `
  <style type="text/css">
    .page-outer-container {
      background: #404040;
    }
    .page-text-container {
      margin-left: 20%;
      margin-right: 20%;
      background: #fff;
      padding: 10px 12px;
    }
    .page-main-image-container {
      width: 46%;
      display: inline-block;
    }
    .page-summary-container {
      width: 50%;
      display: inline-block;
      vertical-align: top;
    }
    .page-main-image {
      width: 100%;
    }
    .key-chip {
      display: inline-block;
    padding: .25em .4em;
    font-size: 75%;
    font-weight: 700;
    line-height: 1;
    text-align: center;
    white-space: nowrap;
    vertical-align: baseline;
    border-radius: .25rem;
    transition: color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out;
    padding-right: .6em;
    padding-left: .6em;
    border-radius: 10rem;
        color: #212529;
    background-color: #f8f9fa;
    }
  </style>`
}
