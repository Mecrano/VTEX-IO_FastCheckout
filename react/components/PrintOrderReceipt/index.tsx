import React, { useEffect, useState } from 'react'
import { useRuntime } from 'vtex.render-runtime'

const generateRandomId = (length = 8): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

const PrintOrderReceipt: React.FC = () => {
  const { route } = useRuntime()
  const [isPrinting, setIsPrinting] = useState<boolean>(false)

  useEffect(() => {
    if (route?.params?.path?.includes('/checkout/orderPlaced')) {
      const urlParams = new URLSearchParams(window.location.search)
      const orderGroup = urlParams.get('og')

      if (orderGroup && !isPrinting) {
        setIsPrinting(true)

        const printIframe = document.createElement('iframe')
        printIframe.style.position = 'absolute'
        printIframe.style.top = '-9999px'
        printIframe.style.left = '-9999px'
        document.body.appendChild(printIframe)

        const transactionId = generateRandomId()

        const htmlContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8" />
            <title>Recibo de Compra</title>
            <style type="text/css">
              @page {
                  size: auto;
                  margin: 0;
              }
              body {
                  font-family: sans-serif;
                  font-size: 12px;
                  text-align: center;
              }
              .container {
                width: 100%;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
              }
              .header {
                display: flex;
                justify-content: center;
                align-items: center;
                margin-bottom: 10px;
                width: 100%;
              }
              .logo-vtex {
                width: 80px;
                margin-right: 10px;
              }
              .logo-massive {
                width: 60px;
              }
              .info {
                margin-bottom: 10px;
                width: 100%;
              }
              .order-id {
                font-size: 16px;
                font-weight: bold;
                margin-bottom: 15px;
                width: 100%;
              }
              .contact {
                margin-top: 20px;
                font-size: 10px;
                width: 100%;
              }
              .qr-code {
                margin-top: 15px;
                width: 100%;
                display: flex;
                justify-content: center;
              }
              .qr-code img {
                width: 80px;
                height: 80px;
              }
            </style>
          </head>
          <body onload="window.print(); window.onafterprint = function() { window.close(); };">
            <div class="container">
              <div class="header">
                <img
                  class="logo-vtex"
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/VTEX_Logo.svg/250px-VTEX_Logo.png"
                  alt="Logo VTEX"
                />
                <img
                  class="logo-massive"
                  src="https://massivespacenew.vtexassets.com/arquivos/Massive1x.svg"
                  alt="Logo Massive Space"
                />
              </div>
              <div class="info">
                <strong>GRACIAS POR TU COMPRA</strong><br />
                Tu pago con datáfono fue <strong>APROBADO</strong> con el ID:<br />
                <span style="font-size: 14px">${transactionId}</span>
              </div>
              <div class="order-id">
                Tu número de orden es:<br />
                <strong>#${orderGroup}-01</strong>
              </div>
              <div class="contact">
                Deseas más información<br />
                <strong>CONTÁCTANOS</strong>
              </div>
              <div class="qr-code">
                <img
                  src="https://massive-01.nyc3.digitaloceanspaces.com/qr-code.svg"
                  alt="Código QR"
                />
              </div>
            </div>
          </body>
        </html>
        `

        const iframeDocument = printIframe.contentWindow?.document
        if (iframeDocument) {
          iframeDocument.open()
          iframeDocument.write(htmlContent)
          iframeDocument.close()

          printIframe.onload = () => {
            try {
              printIframe.contentWindow?.print()

              setTimeout(() => {
                document.body.removeChild(printIframe)
              }, 1000)
            } catch (error) {
              console.error('Error al imprimir:', error)
            }
          }
        }
      }
    }
  }, [route, isPrinting])

  return null
}

export default PrintOrderReceipt
