/**
 * Verify if string is empty
 * 
 * @param str String to be verified
 * 
 * @returns True if string is empty
 */
export const isEmpty = (str: string): boolean => {
    if( 
        !str ||
        typeof str !== 'string' ||
        typeof str === 'number' ||
        typeof str === 'boolean'
    ) {
        return true;
    }

    if( Array.isArray(str) && str.length === 0 ) {
        return true;
    }

    return str.trim() === '';
}


/**
 * Converte uma data para uma descrição curta, exemplos de retorno:
 * Ontem, Seg, Terça, 18 dias, 1 mês
 * 
 * @param {String|Date} dataComparacao Data para comparar com a data atual
 * @returns {String} Descrição do período de forma normalizada
 */
 export const getDescDataPassada = (dataComparacao: Date) => {
    if( !dataComparacao ) {
        return ''
    }

    let dataAtual = new Date()
    
    if( dataComparacao > dataAtual ) {
        // Não é preciso
        return ''
    }

    let diffMili = dataAtual.getTime() - dataComparacao.getTime()
    let diffSegundos = Math.round(diffMili / 1000)

    if( diffSegundos < 60 ) {
        return 'agora'
    }
    let diffMinutos = Math.round(diffSegundos / 60)

    if( diffMinutos < 60 ) {
        return `${diffMinutos} minuto${diffMinutos > 1 ? 's' : ''}`
    }
    let diffHoras = Math.round(diffMinutos / 60)

    if( diffHoras < 24 ) {
        return `${diffHoras} hora${diffHoras > 1 ? 's' : ''}`
    }
    let diffDias = Math.round(diffHoras / 24)

    if( diffDias <= 1 ) {
        return 'ontem'

    } else if( diffDias <= 7 && dataComparacao.getDay() === 0 ) {
        return 'domingo'

    } else if( diffDias <= 7 && dataComparacao.getDay() === 1 ) {
        return 'segunda'

    } else if( diffDias <= 7 && dataComparacao.getDay() === 2 ) {
        return 'terça'

    } else if( diffDias <= 7 && dataComparacao.getDay() === 3 ) {
        return 'quarta'

    } else if( diffDias <= 7 && dataComparacao.getDay() === 4 ) {
        return 'quinta'

    } else if( diffDias <= 7 && dataComparacao.getDay() === 5 ) {
        return 'sexta'

    } else if( diffDias <= 7 && dataComparacao.getDay() === 6 ) {
        return 'sábado'

    } else if( diffDias < 30 ) {
        return `${diffDias} dia${diffDias > 1 ? 's' : ''}`
    }

    let diffWeeks = Math.round(diffDias / 7)

    if( diffWeeks < 4 ) {
        return `${diffWeeks} semana${diffWeeks > 1 ? 's' : ''}`
    }

    let diffMeses = Math.round(diffDias / 30)

    if( diffMeses < 12 ) {
        return `${diffMeses} mês${diffMeses > 1 ? 'es' : ''}`
    }

    let diffAnos = Math.round(diffDias / 365)

    return `${diffAnos} ano${diffAnos > 1 ? 's' : ''}`
}