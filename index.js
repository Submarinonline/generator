const strData = class {
    constructor({ text = '', replaced = [] }) {
        this.text = typeof text !== 'string' ? '' : text
        this.replaced = Array.isArray(replaced) ? replaced : []
    }
}

const replace = (data, dict = {}) => {
    if (!data.text) return new strData(data)
    for (const orig in dict) {
        const translateStr = []
        const re = new RegExp(orig, 'g')
        const splited = data.text.split(re)

        let changed = false

        for (let i = 0; i < splited.length - 1; i++) {
            const origStr = data.text.match(re)[i]
            const correctStr = dict[orig]

            translateStr.push(splited[i])

            const begin = translateStr.join('').length
            const origEnd = begin + origStr.length - 1

            if (
                data.replaced.some(
                    d =>
                        (d.begin <= begin && begin <= d.end) ||
                        (d.begin <= origEnd && origEnd <= d.end)
                )
            ) {
                translateStr.push(origStr)
                continue
            } else {
                translateStr.push(correctStr)
                changed = true
                if (origStr.length == correctStr.length) {
                    data.replaced.push({ begin, end: origEnd })
                } else {
                    const diffLen = correctStr.length - origStr.length

                    data.replaced.push({ begin, end: origEnd + diffLen })
                    data.replaced = data.replaced.map(d =>
                        begin < d.begin ? { begin: d.begin + diffLen, end: d.end + diffLen } : d
                    )
                }
            }
        }
        if (changed) {
            translateStr.push(splited.slice(-1)[0])
            data.text = translateStr.join('')
        }
    }

    return new strData(data)
}

module.exports = {
    strData,
    replace
}