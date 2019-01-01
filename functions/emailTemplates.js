const generate = (emailData) => {
  let template
  switch(emailData.emailTemplate) {
    case 'contactForm':
      template = `
      <link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet">
      <div class="wrapper" style="margin: 0;padding: 1.0rem 0;background-color: #ccc;">
        <table class="message" style="font-family: 'Roboto', sans-serif;border-collapse: collapse;margin: auto;width: 90%;background-color: #fff;">
          <tr><td colspan="2" class="logo" style="border-bottom: 0;padding-bottom: 0;padding: 0.5rem;background-color: #fff;">
            <img src="http://localhost:5000/favicons/favicon-96x96.png" alt="nemacolin logo" style="display: block;margin: auto;">
          </td></tr>
          <tr><td colspan="2" class="logo-caption" style="text-align: center;color: #ba1b1d;border-top: none;padding-top: 0;font-weight: 600;padding: 0.5rem;background-color: #fff;">Nemacolin Inc</td></tr>
          <tr><td colspan="2" class="title" style="font-weight: 600;font-size: 1.25rem;text-align: center;padding: 0.5rem;background-color: #fff;padding-bottom: 1.0rem !important;">New Contact Form Entry</td></tr>
          <tr><td colspan="2" class="hr" style="border: 1px solid #ba1b1d;border-radius: 2px;height: 4px;padding: 0 !important;background-color: #ba1b1d !important;"></td></tr>
          <tr><td class="name from" style="font-weight: 600;width: 10%;padding: 0.5rem;background-color: #fff;padding-top: 1.0rem !important;">From:</td><td class="content from" style="padding: 0.5rem;background-color: #fff;padding-top: 1.0rem !important;">${emailData.name}</td></tr>
          <tr><td class="name" style="font-weight: 600;width: 10%;padding: 0.5rem;background-color: #fff;">Email:</td><td style="padding: 0.5rem;background-color: #fff;">${emailData.email}</td></tr>
          <tr><td colspan="2" class="name message-name" style="font-weight: 600;width: 10%;text-align: center;padding: 0.5rem;background-color: #fff;">Message</td></tr>
          <tr><td colspan="2" style="padding: 0.5rem;background-color: #fff;">${emailData.message}</td></tr>
        </table>
        <table class="info" style="font-family: 'Roboto', sans-serif;border-collapse: collapse;margin: auto;width: 90%;background-color: #fff;">
          <p class="ip-title" style="font-weight: 600;text-align: center;">Submitter Information</p>
          <tr><td style="padding: 0.5rem;background-color: #fff;border: 1px solid #000;">ip</td><td id="ip" style="padding: 0.5rem;background-color: #fff;border: 1px solid #000;">${emailData.ipAddress}</td></tr>
          <tr><td style="padding: 0.5rem;background-color: #fff;border: 1px solid #000;">Host</td><td id="ip-coords" style="padding: 0.5rem;background-color: #fff;border: 1px solid #000;">${emailData.ipHostname}</td></tr>
          <tr><td style="padding: 0.5rem;background-color: #fff;border: 1px solid #000;">Organization</td><td id="ip-org" style="padding: 0.5rem;background-color: #fff;border: 1px solid #000;">${emailData.ipOrganization}</td></tr>
          <tr><td style="padding: 0.5rem;background-color: #fff;border: 1px solid #000;">City</td><td id="ip-city" style="padding: 0.5rem;background-color: #fff;border: 1px solid #000;">${emailData.ipCity}</td></tr>
          <tr><td style="padding: 0.5rem;background-color: #fff;border: 1px solid #000;">Region</td><td id="ip-region" style="padding: 0.5rem;background-color: #fff;border: 1px solid #000;">${emailData.ipRegion}</td></tr>
          <tr><td style="padding: 0.5rem;background-color: #fff;border: 1px solid #000;">Zip Code</td><td id="ip-coords" style="padding: 0.5rem;background-color: #fff;border: 1px solid #000;">${emailData.ipZipcode}</td></tr>
          <tr><td style="padding: 0.5rem;background-color: #fff;border: 1px solid #000;">Country</td><td id="ip-country" style="padding: 0.5rem;background-color: #fff;border: 1px solid #000;">${emailData.ipCountry}</td></tr>
          <tr><td style="padding: 0.5rem;background-color: #fff;border: 1px solid #000;">Coords</td><td id="ip-coords" style="padding: 0.5rem;background-color: #fff;border: 1px solid #000;">${emailData.ipCoords}</td></tr>
        </table>
      </div>
      `
      break
    case 'newUser':
      template = `
      <link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet">
      <div class="wrapper" style="margin: 0;padding: 0.75rem 0;background-color: #ccc;width: 75%;margin: auto;">
        <table class="message" style="font-family: 'Roboto', sans-serif;border-collapse: collapse;margin: auto;width: 95%;background-color: #fff;">
          <tr><td colspan="2" class="logo" style="border-bottom: 0;padding-bottom: 0;padding: 0.5rem;background-color: #fff;text-align: center;">
            <img src="http://localhost:5000/favicons/favicon-96x96.png" alt="nemacolin logo">
          </td></tr>
          <tr><td colspan="2" class="logo-caption" style="text-align: center;color: #ba1b1d;border-top: none;padding-top: 0;font-weight: 600;padding: 0.5rem;background-color: #fff;">Nemacolin Inc</td></tr>
          <tr><td colspan="2" class="title" style="font-weight: 600;font-size: 1.00rem;text-align: center;padding: 0.5rem;background-color: #fff;padding-bottom: 1.0rem !important;">Hello ${emailData.displayName}, your Nemacolin Inc login has been created.</td></tr>
          <tr><td colspan="2" class="hr" style="border: 1px solid #ba1b1d;border-radius: 2px;height: 4px;padding: 0 !important;background-color: #ba1b1d !important;"></td></tr>
          <tr><td colspan="2" class="name from" style="font-weight: 500;width: 100%;padding: 0.5rem;background-color: #fff;padding-top: 1.0rem !important;">You can login to your Nemacolin Inc account using the following email and password:</td></tr>
          <tr><td class="name" style="font-weight: 600;width: 10%;padding: 0.5rem;background-color: #fff;">Email:</td><td style="padding: 0.5rem;background-color: #fff;">${emailData.email}</td></tr>
          <tr><td class="name" style="font-weight: 600;width: 10%;padding: 0.5rem;background-color: #fff;">Password:</td><td style="padding: 0.5rem;background-color: #fff;">${emailData.password}</td></tr>
          <tr><td colspan="2" class="name from" style="font-weight: 500;width: 100%;padding: 0.5rem;background-color: #fff;padding-top: 1.0rem !important;">You will need to verify you email before logging in.&nbsp;&nbsp;Please click the link below to verify your email:</td></tr>
          <tr><td colspan="2" style="padding: 0.5rem;background-color: #fff;"><a href="${emailData.emailLink}">${emailData.emailLink}</a></td></tr>
          <tr><td colspan="2" class="name from" style="font-weight: 500;width: 100%;padding: 0.5rem;background-color: #fff;padding-top: 1.0rem !important;">Thanks!</td></tr>
          <tr><td colspan="2" class="name from" style="font-weight: 500;width: 100%;padding: 0.5rem;background-color: #fff;padding-top: 1.0rem !important;">Angie Visnesky<br>President, Nemacolin Inc.</td></tr>
        </table>
      </div>
      `
      break
  }
  return template
}

module.exports = { generate }
