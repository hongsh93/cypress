/* eslint-disable */

const url = Cypress.config().baseUrl
const segment_name = "e2e_test_timestamp_segment"
const segment_description = "e2e_test for timestamp segment"
const label_name = Cypress.config().timestamp_label
const game_code = "mherosgb"
const id_type = "adid"
const condition_value  = 1620597060000

describe('segment create test timestamp', () => {
    beforeEach(() => {
    })

    it('label with 1 value condition and 1 aggr condition', () => {
        cy.visit('/')
        cy.wait(5000)
        cy.get('[data-cy=세그먼트]').click()
        cy.wait(2500)
        cy.get('[data-cy=segment_create]').click()
        cy.wait(1000)
        cy.get('[data-cy=create_' + id_type + '_segment]').click()
        cy.wait(2500)

        // 필터 변경
        cy.get('[data-cy=filter_not_all_games]').parent().click()  // 라디오 체크박스 클릭
        cy.get('[data-cy=filter_game_code]').parent().click().type(game_code)
        cy.get('[data-cy=game_select_' + game_code + ']').click()
        cy.wait(2500)
        cy.get('[data-cy=label_' + label_name + ']').dblclick()   // 레이블 이름이 label_name인 레이블 조건에 올린다.

        // 날짜 조건 변경
        cy.get('[data-cy=date_condition_0_0]').parent().click()     // 조건 수식 변경
        cy.get('[data-cy=date_condition_value_0_0]').eq(2).click()  // v-select에서 3번째 선택
        cy.get('[data-cy=date_condition_recent_0_0]').click().type("7")  // v-select에서 3번째 선택

        // 레이블 조건 입력
        cy.get('[data-cy=add_value_condition_initial_0_0]').click()       // 조건 추가
        cy.get('[data-cy=value_value_sign_0_0_0_0]').parent().click()     // 조건 수식 변경
        cy.get('[data-cy=value_value_sign_value_0_0_0_0]').eq(1).click()  // v-select에서 2번째 선택
        cy.get('[data-cy=value_value_0_0_0_0]').click()
        cy.get('[data-cy=value_value_date_picker_0_0_0_0]').contains('24').click()
        cy.get('[data-cy=value_value_time_0_0_0_0]').click()
        cy.get('[data-cy=value_value_time_picker_0_0_0_0]').contains('3').click()
        cy.get('[data-cy=value_value_time_picker_0_0_0_0]').contains('15').click()
        cy.get('[data-cy=value_value_time_picker_0_0_0_0]').contains('확인').click()

        var date = new Date()
        var year = date.getFullYear()
        var month = date.getMonth()+1
        var time_str = year + "-" + month + "-24 3:15:00"
        const value_date = Date.parse(time_str)
        console.log(time_str)

        // 집계 조건 입력
        cy.get('[data-cy=add_aggr_condition_initial_0_0]').click()       // 조건 추가
        cy.get('[data-cy=aggr_aggregation_0_0_0_0]').parent().click()     // 조건 수식 변경
        cy.get('[data-cy=aggr_aggregation_value_0_0_0_0]').eq(1).click()  // v-select에서 2번째 선택
        cy.get('[data-cy=aggr_value_0_0_0_0]').click()
        cy.get('[data-cy=aggr_value_date_picker_0_0_0_0]').contains('16').click()
        cy.get('[data-cy=aggr_value_time_0_0_0_0]').click()
        cy.get('[data-cy=aggr_value_time_picker_0_0_0_0]').contains('5').click()
        cy.get('[data-cy=aggr_value_time_picker_0_0_0_0]').contains('25').click()
        cy.get('[data-cy=aggr_value_time_picker_0_0_0_0]').contains('확인').click()

        var time_str2 = year + "-" + month + "-16 5:25:00"
        const value_date2 = Date.parse(time_str2)
        console.log(time_str2)

        // 생성
        cy.get('[data-cy=title_create]').click()
        cy.get('[data-cy=title_segment_name]').click().type(segment_name)
        cy.get('[data-cy=title_segment_description]').click().type(segment_description)
        cy.get('[data-cy=title_result_select_all]').parent().click()

        cy.get('[data-cy=title_create_create]').click()
        cy.intercept('POST', url + 'mgmt/segment/jobs', (req) => {
            console.log(req)
            req.continue((res) => {
                console.log(res)
                expect(res.body.definitions[0].name).to.eq(segment_name)
                expect(res.body.definitions[0].description).to.eq(segment_description)
                expect(res.body.definitions[0].query_config.meta.idType).to.eq(id_type)
                expect(res.body.definitions[0].query_config.meta.labelRelation).to.eq("(label_" + label_name + "#1)")
                expect(res.body.definitions[0].query_config.meta.segmentLabelQueryMetas[0].label).to.eq(label_name)
                expect(res.body.definitions[0].query_config.meta.segmentLabelQueryMetas[0].dataType).to.eq("TIMESTAMP")
                expect(res.body.definitions[0].query_config.meta.segmentLabelQueryMetas[0].gameCodes[0]).to.eq(game_code)
                expect(res.body.definitions[0].query_config.meta.segmentLabelQueryMetas[0].startJobDate).to.eq("@TODAY-7")
                expect(res.body.definitions[0].query_config.meta.segmentLabelQueryMetas[0].endJobDate).to.eq("@TODAY")

                expect(res.body.definitions[0].query_config.meta.segmentLabelQueryMetas[0].segmentColumnInfosList[0].segmentColumnInfos[0].column).to.eq("LOWER(id)")
                expect(res.body.definitions[0].query_config.meta.segmentLabelQueryMetas[0].segmentColumnInfosList[0].segmentColumnInfos[0].alias).to.eq("id")
                expect(res.body.definitions[0].query_config.meta.segmentLabelQueryMetas[0].segmentColumnInfosList[0].segmentColumnInfos[1].column).to.eq("game_code")
                expect(res.body.definitions[0].query_config.meta.segmentLabelQueryMetas[0].segmentColumnInfosList[1].segmentColumnInfos[0].column).to.eq("game_code")
                expect(res.body.definitions[0].query_config.meta.segmentLabelQueryMetas[0].segmentColumnInfosList[1].segmentColumnInfos[0].alias).to.eq(label_name + "_GAMECODE")

                expect(res.body.definitions[0].query_config.meta.segmentLabelQueryMetas[0].segmentColumnInfosList[2].segmentColumnInfos[0].column).to.eq("SAFE_CAST(value AS INT64)")
                expect(res.body.definitions[0].query_config.meta.segmentLabelQueryMetas[0].segmentColumnInfosList[2].segmentColumnInfos[0].conditionOp).to.eq("!=")
                expect(res.body.definitions[0].query_config.meta.segmentLabelQueryMetas[0].segmentColumnInfosList[2].segmentColumnInfos[0].conditionValue).to.eq("" + value_date + "")
                expect(res.body.definitions[0].query_config.meta.segmentLabelQueryMetas[0].segmentColumnInfosList[2].segmentColumnInfos[0].alias).to.eq(label_name)

                expect(res.body.definitions[0].query_config.meta.segmentLabelQueryMetas[0].segmentColumnInfosList[3].segmentColumnInfos[0].column).to.eq("MAX(SAFE_CAST(value AS INT64))")
                expect(res.body.definitions[0].query_config.meta.segmentLabelQueryMetas[0].segmentColumnInfosList[3].segmentColumnInfos[0].conditionOp).to.eq("=")
                expect(res.body.definitions[0].query_config.meta.segmentLabelQueryMetas[0].segmentColumnInfosList[3].segmentColumnInfos[0].conditionValue).to.eq("" + value_date2 + "")
                expect(res.body.definitions[0].query_config.meta.segmentLabelQueryMetas[0].segmentColumnInfosList[3].segmentColumnInfos[0].aggrOp).to.eq("MAX")
                expect(res.body.definitions[0].query_config.meta.segmentLabelQueryMetas[0].segmentColumnInfosList[3].segmentColumnInfos[0].alias).to.eq(label_name + "_MAX")
            })
        }).as('segmentCreate')
        cy.wait('@segmentCreate', {requestTimeout: 20000})

        cy.get('[data-cy=segment_create_after_close').click()
    })
})

describe('delete timestamp segment', () => {
    var segment_id = 0
    it('delete timestamp label',  () => {
        cy.visit('/')
        cy.wait(5000)
        cy.intercept('POST', url + 'mgmt/segment/jobs', (req) => {
            console.log(req)
            req.continue((res) => {
                console.log(res)
                if (res.body.definitions[0].name === segment_name) {
                    expect(res.body.definitions[0].create_source).to.eq("create")
                    expect(res.body.definitions[0].description).to.eq(segment_description)
                    expect(res.body.definitions[0].target_games[0]).to.eq(game_code)
                    segment_id = res.body.definitions[0].id
                }
            })
        }).as('segmentList')
        cy.get('[data-cy=세그먼트]').click()
        cy.wait('@segmentList').then(() => {
            console.log(segment_id)
            cy.intercept('DELETE', url + 'mgmt/segment/job/definition', (req) => {
                console.log(req)
                req.continue((res) => {
                    console.log(res)
                    expect(res.body.id).to.eq(segment_id)
                })
            }).as('segmentDelete')
            cy.get("[data-cy=segment_" + segment_id + "_delete]").click().wait('@segmentDelete')
        })
    })
})
