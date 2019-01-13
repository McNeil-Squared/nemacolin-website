const build = (templateData) => {
  return `
    <mj-section background-color="#fff">
      <mj-column>
        <mj-text align="center" font-size="18px" color="#333" font-family="Ubuntu, Helvetica, Arial, sans-serif" padding="0px 25px 16px 25px">${templateData[0]}'s IP Information:
        </mj-text>
        <mj-table>
          <tr>
            <td style="padding: 4px 8px;border: 1px solid #333;">IP</td>
            <td style="padding: 4px 8px;border: 1px solid #333;">${templateData[1]}</td>
          </tr>
          <tr>
            <td style="padding: 4px 8px;border: 1px solid black;">Host</td>
            <td style="padding: 4px 8px;border: 1px solid black;">${templateData[2]}</td>
          </tr>
          <tr>
            <td style="padding: 4px 8px;border: 1px solid black;">Organization</td>
            <td style="padding: 4px 8px;border: 1px solid black;">${templateData[3]}</td>
          </tr>
          <tr>
            <td style="padding: 4px 8px;border: 1px solid black;">City</td>
            <td style="padding: 4px 8px;border: 1px solid black;">${templateData[4]}</td>
          </tr>
          <tr>
            <td style="padding: 4px 8px;border: 1px solid black;">Region</td>
            <td style="padding: 4px 8px;border: 1px solid black;">${templateData[5]}</td>
          </tr>
          <tr>
            <td style="padding: 4px 8px;border: 1px solid black;">Zip Code</td>
            <td style="padding: 4px 8px;border: 1px solid black;">${templateData[6]}</td>
          </tr>
          <tr>
            <td style="padding: 4px 8px;border: 1px solid black;">Country</td>
            <td style="padding: 4px 8px;border: 1px solid black;">${templateData[7]}</td>
          </tr>
          <tr>
            <td style="padding: 4px 8px;border: 1px solid black;">GPS Coords</td>
            <td style="padding: 4px 8px;border: 1px solid black;">${templateData[8]}</td>
          </tr>
        </mj-table>
      </mj-column>
    </mj-section>

  `
}

module.exports = { build }