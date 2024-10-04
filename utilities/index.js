const invModel = require("../models/inventory-model")
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list
  /*let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'*/
  list += '<a href="/" title="Home page">Home</a>'
  data.rows.forEach((row) => {
    /*list += "<li>"*/
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    /*list += "</li>"*/
  })
  /*list += "</ul>"*/
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* **************************************
* Build the vehicle view HTML
* ************************************ */
Util.buildVehicleCard = async function(data) {
  let card
  if(data.length === 1) {
    card = '<section id="vehicle-details">'
    card += '<img src="'+ data[0].inv_image +'" alt="Image of '+ data[0].inv_make + ' ' + data[0].inv_model + '">'
    card += '<h3>' + data[0].inv_make + ' ' + data[0].inv_model + ' ' + 'Details</h3>'
    card += '<p><strong>Price:</strong> $' + new Intl.NumberFormat('en-US').format(data[0].inv_price) + '</p>'
    card += '<p><strong>Description:</strong> ' + data[0].inv_description +'</p>'
    card += '<p><strong>Color:</strong> ' + data[0].inv_color +'</p>'
    card += '<p><strong>Miles:</strong> ' + data[0].inv_miles +'</p>'
    card+= '</section>'
  } else {
    card += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return card
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util