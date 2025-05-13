export interface TransactionData {
  orderFormId: string
  uniqueIdentifier: string
}

export interface TransactionResponse {
  success: boolean
  status?: 'waiting' | 'approved' | 'declined' | 'canceled' | 'unknown'
  message?: string
}

export class DatafonoService {
  private static instance: DatafonoService
  private readonly BASE_URL = 'https://credibanco.massivespace.pro/api/'
  private readonly UNIQUE_IDENTIFIER = '620685ae-ce53-4aa6-ad6c-2800de3f4ad9'

  private constructor() {}

  public static getInstance(): DatafonoService {
    if (!DatafonoService.instance) {
      DatafonoService.instance = new DatafonoService()
    }
    return DatafonoService.instance
  }

  public getUniqueIdentifier(): string {
    return this.UNIQUE_IDENTIFIER
  }

  public async startTransaction(orderFormId: string): Promise<TransactionResponse> {
    try {
      const data: TransactionData = {
        orderFormId,
        uniqueIdentifier: this.UNIQUE_IDENTIFIER,
      }

      const response = await fetch(`${this.BASE_URL}transactions/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }

      const jsonResponse = await response.json()

      if (jsonResponse.message && jsonResponse.message.includes('Token no valido')) {
        throw new Error(jsonResponse.message)
      }

      return jsonResponse
    } catch (error) {
      console.error('Error en startTransaction:', error)
      throw error
    }
  }

  public async validateTransaction(orderFormId: string): Promise<TransactionResponse> {
    try {
      const data: TransactionData = {
        orderFormId,
        uniqueIdentifier: this.UNIQUE_IDENTIFIER,
      }

      const response = await fetch(`${this.BASE_URL}transactions/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }

      const jsonResponse = await response.json()

      if (jsonResponse.message && jsonResponse.message.includes('Token no valido')) {
        throw new Error(jsonResponse.message)
      }

      return jsonResponse
    } catch (error) {
      console.error('Error en validateTransaction:', error)
      throw error
    }
  }

  public async cancelTransaction(orderFormId: string): Promise<TransactionResponse> {
    try {
      const data: TransactionData = {
        orderFormId,
        uniqueIdentifier: this.UNIQUE_IDENTIFIER,
      }

      const response = await fetch(`${this.BASE_URL}transactions/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }

      const jsonResponse = await response.json()

      if (jsonResponse.message && jsonResponse.message.includes('Token no valido')) {
        throw new Error(jsonResponse.message)
      }

      return jsonResponse
    } catch (error) {
      console.error('Error en cancelTransaction:', error)
      throw error
    }
  }
}

export default DatafonoService.getInstance()
