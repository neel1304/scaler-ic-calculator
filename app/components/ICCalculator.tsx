'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ICInput, ICResult, EmploymentStatus } from '@/lib/types'
import { calculateICIncentive } from '@/lib/icCalculator'
import { icInputSchema } from '@/lib/validation'
import { formatINR } from '@/lib/utils'
import { ZodError } from 'zod'

export default function ICCalculator() {
  const [showBreakdown, setShowBreakdown] = useState(false)
  
  const [icData, setICData] = useState<ICInput>({
    employmentStatus: 'Non-Probation',
    cohortWeeks: 4,
    netSales: 10,
    nonDiscountedNetSales: 6,
    referralSalesCount: 2,
    managerCouponSalesCount: 2,
  })
  const [icErrors, setICErrors] = useState<Record<string, string>>({})
  const [icResult, setICResult] = useState<ICResult | null>(null)

  const handleICChange = (field: keyof ICInput, value: number | EmploymentStatus) => {
    const newData = { ...icData, [field]: value }
    setICData(newData)
    setTimeout(() => {
      try {
        const validated = icInputSchema.parse(newData)
        const result = calculateICIncentive(validated)
        setICResult(result)
        setICErrors({})
      } catch (error) {
        if (error instanceof ZodError) {
          const errors: Record<string, string> = {}
          error.errors.forEach((err) => {
            if (err.path.length > 0) {
              errors[err.path[0] as string] = err.message
            }
          })
          setICErrors(errors)
        }
      }
    }, 300)
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <div className="text-center">
            <h1 className="text-5xl font-bold font-display bg-gradient-to-r from-scaler-orange to-orange-600 bg-clip-text text-transparent mb-3">
              IC Incentive Calculator
            </h1>
            <p className="text-slate-600 text-lg">
              BDA, S.BDA, AM, BDS · February 2026 Cohort
            </p>
          </div>
        </div>

        {/* IC Form */}
        <div className="space-y-6">
          <div className="result-card">
            <h2 className="text-2xl font-bold font-display text-scaler-orange mb-6">
              Individual Performance Inputs
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="label">Employment Status</label>
                <select
                  value={icData.employmentStatus}
                  onChange={(e) => handleICChange('employmentStatus', e.target.value as EmploymentStatus)}
                  className="input-field"
                >
                  <option value="Non-Probation">Non-Probation</option>
                  <option value="Probation">Probation</option>
                </select>
              </div>

              <div>
                <label className="label">
                  Cohort Weeks
                  <span className="text-slate-400 text-xs ml-1">(locked to 4)</span>
                </label>
                <input
                  type="number"
                  value={4}
                  disabled
                  className="input-field bg-slate-100 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="label">Net Sales</label>
                <input
                  type="number"
                  min="0"
                  value={icData.netSales}
                  onChange={(e) => handleICChange('netSales', parseInt(e.target.value) || 0)}
                  className={`input-field ${icErrors.netSales ? 'input-error' : ''}`}
                />
                {icErrors.netSales && (
                  <p className="error-text">{icErrors.netSales}</p>
                )}
              </div>

              <div>
                <label className="label">Non-Discounted Net Sales</label>
                <input
                  type="number"
                  min="0"
                  value={icData.nonDiscountedNetSales}
                  onChange={(e) => handleICChange('nonDiscountedNetSales', parseInt(e.target.value) || 0)}
                  className={`input-field ${icErrors.nonDiscountedNetSales ? 'input-error' : ''}`}
                />
                {icErrors.nonDiscountedNetSales && (
                  <p className="error-text">{icErrors.nonDiscountedNetSales}</p>
                )}
              </div>

              <div>
                <label className="label">Referral Sales Count</label>
                <input
                  type="number"
                  min="0"
                  value={icData.referralSalesCount}
                  onChange={(e) => handleICChange('referralSalesCount', parseInt(e.target.value) || 0)}
                  className={`input-field ${icErrors.referralSalesCount ? 'input-error' : ''}`}
                />
                {icErrors.referralSalesCount && (
                  <p className="error-text">{icErrors.referralSalesCount}</p>
                )}
              </div>

              <div>
                <label className="label">Manager Coupon Sales Count</label>
                <input
                  type="number"
                  min="0"
                  value={icData.managerCouponSalesCount}
                  onChange={(e) => handleICChange('managerCouponSalesCount', parseInt(e.target.value) || 0)}
                  className={`input-field ${icErrors.managerCouponSalesCount ? 'input-error' : ''}`}
                />
                {icErrors.managerCouponSalesCount && (
                  <p className="error-text">{icErrors.managerCouponSalesCount}</p>
                )}
              </div>
            </div>

            {icData.employmentStatus === 'Probation' && (
              <div className="mt-4 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                <p className="text-sm text-yellow-700">
                  <strong>Note:</strong> Probation incentive applies only to non-discounted net sales. 
                  Referral and manager coupon sales are not paid during probation.
                </p>
              </div>
            )}
          </div>

          {/* IC Results */}
          {icResult && (
            <div className="result-card">
              {!icResult.eligible ? (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
                    <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-red-600 mb-2">Not Eligible</h3>
                  <p className="text-slate-600">{icResult.message}</p>
                </div>
              ) : (
                <>
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                      <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-3xl font-bold text-scaler-orange mb-2">Eligible!</h3>
                    <p className="text-5xl font-bold font-display bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">
                      {formatINR(icResult.totalIncentive)}
                    </p>
                    <p className="text-slate-600 mt-2">Total Incentive Amount</p>
                  </div>

                  {/* Key Metrics */}
                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                      <p className="text-sm text-slate-600 mb-1">Net Sales</p>
                      <p className="text-2xl font-bold text-scaler-blue">{icResult.netSales}</p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                      <p className="text-sm text-slate-600 mb-1">Slab</p>
                      <p className="text-2xl font-bold text-purple-600">{icResult.slabLabel}</p>
                    </div>
                  </div>

                  {/* Breakdown Toggle */}
                  <button
                    onClick={() => setShowBreakdown(!showBreakdown)}
                    className="w-full py-3 px-4 bg-slate-100 hover:bg-slate-200 rounded-lg font-semibold text-slate-700 transition-colors duration-200 flex items-center justify-between"
                  >
                    <span>How this was calculated</span>
                    <svg
                      className={`w-5 h-5 transform transition-transform ${showBreakdown ? 'rotate-180' : ''}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Breakdown Details */}
                  {showBreakdown && (
                    <div className="mt-6 space-y-4 pt-6 border-t-2 border-slate-200">
                      <div className="space-y-3">
                        {icData.employmentStatus === 'Non-Probation' && (
                          <div className="flex justify-between items-center">
                            <span className="text-slate-600">Incentive per non-discounted sale:</span>
                            <span className="font-semibold">{formatINR(icResult.incentivePerNonDiscountedSale)}</span>
                          </div>
                        )}
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600">
                            Non-discounted sales ({icData.nonDiscountedNetSales} × {formatINR(icResult.incentivePerNonDiscountedSale)}):
                          </span>
                          <span className="font-semibold text-green-600">{formatINR(icResult.nonDiscountedIncentive)}</span>
                        </div>
                        {icData.employmentStatus === 'Non-Probation' && (
                          <>
                            <div className="flex justify-between items-center">
                              <span className="text-slate-600">
                                Referral sales ({icData.referralSalesCount} × ₹5,000):
                              </span>
                              <span className="font-semibold text-blue-600">{formatINR(icResult.referralIncentive)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-slate-600">
                                Manager coupon sales ({icData.managerCouponSalesCount} × ₹10,000):
                              </span>
                              <span className="font-semibold text-purple-600">{formatINR(icResult.managerCouponIncentive)}</span>
                            </div>
                          </>
                        )}
                        <div className="flex justify-between items-center pt-3 border-t-2 border-scaler-orange">
                          <span className="font-bold text-lg">Total Incentive:</span>
                          <span className="font-bold text-2xl text-green-600">{formatINR(icResult.totalIncentive)}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {icResult.message && (
                    <div className="mt-4 bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
                      <p className="text-sm text-blue-700">{icResult.message}</p>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-slate-500 text-sm">
          <p>IC Calculator · February 2026 Cohort</p>
          <p className="mt-1">This is a calculation tool only. Official payouts are subject to policy terms.</p>
        </div>
      </div>
    </div>
  )
}
