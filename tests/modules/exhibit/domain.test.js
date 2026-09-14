import { describe, it, expect } from 'vitest'
import { validateExhibitItem } from '../../../src/modules/exhibit/domain/exhibit-item.js'
import { validateDish } from '../../../src/modules/exhibit/domain/dish.js'
import { validateChef } from '../../../src/modules/exhibit/domain/chef.js'
import { validatePeriod } from '../../../src/modules/exhibit/domain/period.js'

// ───────────────────────────────────────────
// ExhibitItem
// ───────────────────────────────────────────
describe('validateExhibitItem', () => {
  it('正常数据应通过验证', () => {
    const item = {
      id: 1,
      name: '武昌鱼',
      summary: '湖北名菜，历史悠久',
      image: 'https://example.com/wuchangyu.jpg',
      type: 'dish'
    }
    const result = validateExhibitItem(item)
    expect(result.valid).toBe(true)
    expect(result.errors).toHaveLength(0)
  })

  it('缺少 id 时应报错', () => {
    const item = {
      name: '武昌鱼',
      summary: '湖北名菜',
      image: 'https://example.com/wuchangyu.jpg',
      type: 'dish'
    }
    const result = validateExhibitItem(item)
    expect(result.valid).toBe(false)
    expect(result.errors.some(e => e.includes('id'))).toBe(true)
  })

  it('缺少 name 时应报错', () => {
    const item = {
      id: 1,
      summary: '湖北名菜',
      image: 'https://example.com/wuchangyu.jpg',
      type: 'dish'
    }
    const result = validateExhibitItem(item)
    expect(result.valid).toBe(false)
    expect(result.errors.some(e => e.includes('name'))).toBe(true)
  })

  it('缺少 type 时应报错', () => {
    const item = {
      id: 1,
      name: '武昌鱼',
      summary: '湖北名菜',
      image: 'https://example.com/wuchangyu.jpg'
    }
    const result = validateExhibitItem(item)
    expect(result.valid).toBe(false)
    expect(result.errors.some(e => e.includes('type'))).toBe(true)
  })

  it('无效的 type 值应被拒绝', () => {
    const item = {
      id: 1,
      name: '武昌鱼',
      summary: '湖北名菜',
      image: 'https://example.com/wuchangyu.jpg',
      type: 'restaurant'
    }
    const result = validateExhibitItem(item)
    expect(result.valid).toBe(false)
    expect(result.errors.some(e => e.includes('type'))).toBe(true)
  })

  it('type 为 chef 时应通过验证', () => {
    const item = {
      id: 2,
      name: '卢永良',
      summary: '楚菜泰斗',
      image: 'https://example.com/luyongliang.jpg',
      type: 'chef'
    }
    const result = validateExhibitItem(item)
    expect(result.valid).toBe(true)
    expect(result.errors).toHaveLength(0)
  })
})

// ───────────────────────────────────────────
// Dish
// ───────────────────────────────────────────
describe('validateDish', () => {
  it('正常数据应通过验证', () => {
    const dish = {
      id: 1,
      name: '排骨藕汤',
      image: 'https://example.com/ougeng.jpg',
      history: '湖北传统名菜，起源于楚国时期',
      technique: '将排骨与莲藕慢炖两小时',
      ingredients: ['排骨', '莲藕', '盐', '姜']
    }
    const result = validateDish(dish)
    expect(result.valid).toBe(true)
    expect(result.errors).toHaveLength(0)
  })

  it('缺少 id 时应报错', () => {
    const dish = {
      name: '排骨藕汤',
      image: 'https://example.com/ougeng.jpg'
    }
    const result = validateDish(dish)
    expect(result.valid).toBe(false)
    expect(result.errors.some(e => e.includes('id'))).toBe(true)
  })

  it('缺少 name 时应报错', () => {
    const dish = {
      id: 1,
      image: 'https://example.com/ougeng.jpg'
    }
    const result = validateDish(dish)
    expect(result.valid).toBe(false)
    expect(result.errors.some(e => e.includes('name'))).toBe(true)
  })

  it('ingredients 不是数组时应报错', () => {
    const dish = {
      id: 1,
      name: '排骨藕汤',
      ingredients: '排骨、莲藕'
    }
    const result = validateDish(dish)
    expect(result.valid).toBe(false)
    expect(result.errors.some(e => e.includes('ingredients'))).toBe(true)
  })

  it('可选字段缺失时仍应通过验证', () => {
    const dish = {
      id: 1,
      name: '排骨藕汤'
    }
    const result = validateDish(dish)
    expect(result.valid).toBe(true)
    expect(result.errors).toHaveLength(0)
  })
})

// ───────────────────────────────────────────
// Chef
// ───────────────────────────────────────────
describe('validateChef', () => {
  it('正常数据应通过验证', () => {
    const chef = {
      id: 101,
      name: '卢永良',
      photo: 'https://example.com/luyongliang.jpg',
      bio: '中国烹饪大师，楚菜代表性传承人',
      signatureDishes: ['武昌鱼', '排骨藕汤']
    }
    const result = validateChef(chef)
    expect(result.valid).toBe(true)
    expect(result.errors).toHaveLength(0)
  })

  it('缺少 id 时应报错', () => {
    const chef = {
      name: '卢永良',
      photo: 'https://example.com/luyongliang.jpg'
    }
    const result = validateChef(chef)
    expect(result.valid).toBe(false)
    expect(result.errors.some(e => e.includes('id'))).toBe(true)
  })

  it('缺少 name 时应报错', () => {
    const chef = {
      id: 101,
      photo: 'https://example.com/luyongliang.jpg'
    }
    const result = validateChef(chef)
    expect(result.valid).toBe(false)
    expect(result.errors.some(e => e.includes('name'))).toBe(true)
  })

  it('signatureDishes 不是数组时应报错', () => {
    const chef = {
      id: 101,
      name: '卢永良',
      signatureDishes: '武昌鱼、排骨藕汤'
    }
    const result = validateChef(chef)
    expect(result.valid).toBe(false)
    expect(result.errors.some(e => e.includes('signatureDishes'))).toBe(true)
  })

  it('可选字段缺失时仍应通过验证', () => {
    const chef = {
      id: 101,
      name: '卢永良'
    }
    const result = validateChef(chef)
    expect(result.valid).toBe(true)
    expect(result.errors).toHaveLength(0)
  })
})

// ───────────────────────────────────────────
// Period
// ───────────────────────────────────────────
describe('validatePeriod', () => {
  it('正常数据应通过验证', () => {
    const period = {
      id: 1,
      name: '秦汉',
      characteristics: '楚菜雏形形成，以蒸煮为主',
      representativeDishes: ['楚式鱼羹', '云梦泽鱼']
    }
    const result = validatePeriod(period)
    expect(result.valid).toBe(true)
    expect(result.errors).toHaveLength(0)
  })

  it('缺少 id 时应报错', () => {
    const period = {
      name: '秦汉',
      characteristics: '楚菜雏形形成'
    }
    const result = validatePeriod(period)
    expect(result.valid).toBe(false)
    expect(result.errors.some(e => e.includes('id'))).toBe(true)
  })

  it('缺少 name 时应报错', () => {
    const period = {
      id: 1,
      characteristics: '楚菜雏形形成'
    }
    const result = validatePeriod(period)
    expect(result.valid).toBe(false)
    expect(result.errors.some(e => e.includes('name'))).toBe(true)
  })

  it('representativeDishes 不是数组时应报错', () => {
    const period = {
      id: 1,
      name: '秦汉',
      representativeDishes: '楚式鱼羹'
    }
    const result = validatePeriod(period)
    expect(result.valid).toBe(false)
    expect(result.errors.some(e => e.includes('representativeDishes'))).toBe(true)
  })

  it('可选字段缺失时仍应通过验证', () => {
    const period = {
      id: 1,
      name: '秦汉'
    }
    const result = validatePeriod(period)
    expect(result.valid).toBe(true)
    expect(result.errors).toHaveLength(0)
  })
})
