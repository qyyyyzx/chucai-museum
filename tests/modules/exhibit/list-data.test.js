import { describe, it, expect } from 'vitest'

/**
 * 展陈列表页 mock 数据结构验证
 * 验证硬编码数据符合预期结构，后续迁移到 platform/mock/ 时可复用
 */

const REQUIRED_DISH_FIELDS = ['id', 'name', 'summary', 'image', 'type']
const REQUIRED_CHEF_FIELDS = ['id', 'name', 'summary', 'image', 'type']

// 与 list.vue 中硬编码数据一致，迁移时同步更新
const dishes = [
  { id: 1, name: '武昌鱼', summary: '楚菜经典名菜，清蒸武昌鱼，肉质鲜嫩，汤汁清香', image: '/static/exhibit/wuchangyu.jpg', type: 'dish' },
  { id: 2, name: '排骨藕汤', summary: '湖北家家户户的传统汤品，藕粉糯、排骨酥烂', image: '/static/exhibit/paigulotang.jpg', type: 'dish' },
  { id: 3, name: '沔阳三蒸', summary: '蒸菜、蒸鱼、蒸肉，湖北沔阳传统蒸菜技艺', image: '/static/exhibit/mianyang.jpg', type: 'dish' },
  { id: 4, name: '红菜薹炒腊肉', summary: '武汉冬季时令名菜，红菜薹脆嫩、腊肉咸香', image: '/static/exhibit/hongcaitai.jpg', type: 'dish' },
  { id: 5, name: '潜江油焖大虾', summary: '潜江特色小龙虾，麻辣鲜香，色泽红亮', image: '/static/exhibit/qianjiangxia.jpg', type: 'dish' },
  { id: 6, name: '黄陂三合', summary: '肉丸、鱼丸、肉糕三合一，黄陂传统宴席菜', image: '/static/exhibit/huangpi.jpg', type: 'dish' },
  { id: 7, name: '东坡肉', summary: '苏东坡谪居黄州时所创，肥而不腻、入口即化', image: '/static/exhibit/dongporou.jpg', type: 'dish' },
  { id: 8, name: '荆沙甲鱼', summary: '荆州传统名菜，甲鱼软糯、汤汁浓郁', image: '/static/exhibit/jingsha.jpg', type: 'dish' },
  { id: 9, name: '钟祥蟠龙菜', summary: '钟祥宫廷菜，色泽鲜艳、造型似龙', image: '/static/exhibit/panlongcai.jpg', type: 'dish' },
  { id: 10, name: '珍珠丸子', summary: '糯米裹肉丸，晶莹剔透如珍珠，湖北蒸菜代表', image: '/static/exhibit/zhenzhuwanzi.jpg', type: 'dish' }
]

const chefs = [
  { id: 101, name: '卢永良', summary: '中国烹饪大师，楚菜非遗传承人，擅长传统楚菜技法', image: '/static/exhibit/chef-lu.jpg', type: 'chef' },
  { id: 102, name: '孙昌弼', summary: '鄂菜泰斗，深耕楚菜数十年，培养大批楚菜人才', image: '/static/exhibit/chef-sun.jpg', type: 'chef' },
  { id: 103, name: '余明社', summary: '中国烹饪大师，潜江油焖大虾技艺推广者', image: '/static/exhibit/chef-yu.jpg', type: 'chef' },
  { id: 104, name: '邹志平', summary: '楚菜名厨，专注湖北地方菜研究与创新', image: '/static/exhibit/chef-zou.jpg', type: 'chef' },
  { id: 105, name: '喻少林', summary: '中式烹调高级技师，传承沔阳三蒸技艺', image: '/static/exhibit/chef-yu2.jpg', type: 'chef' }
]

describe('菜品数据结构', () => {
  it('应有 10 条菜品数据', () => {
    expect(dishes).toHaveLength(10)
  })

  it('每条菜品应包含所有必填字段', () => {
    for (const dish of dishes) {
      for (const field of REQUIRED_DISH_FIELDS) {
        expect(dish).toHaveProperty(field)
        expect(dish[field]).toBeTruthy()
      }
    }
  })

  it('菜品 type 应为 dish', () => {
    for (const dish of dishes) {
      expect(dish.type).toBe('dish')
    }
  })

  it('菜品 id 应为正整数且不重复', () => {
    const ids = dishes.map(d => d.id)
    const uniqueIds = new Set(ids)
    expect(uniqueIds.size).toBe(ids.length)
    for (const id of ids) {
      expect(id).toBeGreaterThan(0)
      expect(Number.isInteger(id)).toBe(true)
    }
  })
})

describe('名厨数据结构', () => {
  it('应有 5 条名厨数据', () => {
    expect(chefs).toHaveLength(5)
  })

  it('每条名厨应包含所有必填字段', () => {
    for (const chef of chefs) {
      for (const field of REQUIRED_CHEF_FIELDS) {
        expect(chef).toHaveProperty(field)
        expect(chef[field]).toBeTruthy()
      }
    }
  })

  it('名厨 type 应为 chef', () => {
    for (const chef of chefs) {
      expect(chef.type).toBe('chef')
    }
  })

  it('名厨 id 应为正整数且不重复，且不与菜品 id 冲突', () => {
    const chefIds = chefs.map(c => c.id)
    const dishIds = dishes.map(d => d.id)
    const uniqueChefIds = new Set(chefIds)
    expect(uniqueChefIds.size).toBe(chefIds.length)
    for (const id of chefIds) {
      expect(dishIds).not.toContain(id)
    }
  })
})
