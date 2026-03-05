"use client"

import React from "react"
import { Loader2 } from "lucide-react"

const LoadingOverlay = () => {
    return (
        <div className="loading-wrapper">
            <div className="loading-shadow-wrapper bg-[var(--bg-secondary)] shadow-soft-lg border border-[var(--border-subtle)]">
                <div className="loading-shadow">
                    <Loader2 className="loading-animation w-12 h-12 text-[#663820]" />
                    <div className="text-center space-y-2">
                        <h2 className="loading-title font-serif">Synthesizing your book...</h2>
                        <p className="text-[var(--text-secondary)] font-medium">
                            We&apos;re preparing your literary experience.
                        </p>
                    </div>
                    <div className="loading-progress">
                        <div className="loading-progress-item">
                            <span className="loading-progress-status" />
                            <span className="text-[var(--text-secondary)]">Analyzing PDF content...</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoadingOverlay
