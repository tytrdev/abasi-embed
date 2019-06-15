const _ = require('lodash');

class Utils {
  static sendEmail(transporter, email) {
    const mailOptions = {
      from: 'Abasi Guitars Sales <ivan@abasiguitars.com>', // Something like: Jane Doe <janedoe@gmail.com>
      to: email,
      subject: 'Abasi Guitars Receipt', // email subject
      html: 'Thank you for your purchase' // email content in HTML
    };
  
    transporter.sendMail(mailOptions);
  }

  static calculatePrice(snapshot, specs) {
    const configs = [];

    snapshot.forEach((doc) => {
      const config = doc.data();
      config.id = doc.id;
      configs.push(config);
    });
    
    // Create array of options to validate pricing
    const options = _.flatten(_.map(configs, c => c.options));
  
    // Validate price
    let price = 0;
  
    _.each(specs, spec => {
      if (spec.type === 'model') {
        price += 2399; // TODO: Handle this way better
        return;
      }
      
      // TODO: Handle invalid option id
      const option = _.find(options, o => o.id == spec.id);
      price += Number.parseInt(option.price);
    });

    return price;
  }
}

module.exports = Utils;
