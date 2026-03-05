"use client"

import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Upload, Image as ImageIcon, X } from "lucide-react"

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import LoadingOverlay from "@/components/LoadingOverlay"
import { cn } from "@/lib/utils"

const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB

const formSchema = z.object({
    pdfFile: z.instanceof(File, { message: "PDF file is required" }).refine((file) => file.size <= MAX_FILE_SIZE, "Max file size is 50MB"),
    coverImage: z.instanceof(File).optional(),
    title: z.string().min(1, "Title is required"),
    author: z.string().min(1, "Author name is required"),
    voice: z.string().min(1, "Please choose a voice"),
})

type FormValues = z.infer<typeof formSchema>

const voices = {
    male: [
        { id: "dave", name: "Dave", desc: "Young male, British-Essex, casual & conversational" },
        { id: "daniel", name: "Daniel", desc: "Middle-aged male, British, authoritative but warm" },
        { id: "chris", name: "Chris", desc: "Male, casual & easy-going" },
    ],
    female: [
        { id: "rachel", name: "Rachel", desc: "Young female, American, calm & clear" },
        { id: "sarah", name: "Sarah", desc: "Young female, American, soft & approachable" },
    ],
}

const UploadForm = () => {
    const [isSynthesizing, setIsSynthesizing] = useState(false)
    const [pdfName, setPdfName] = useState<string | null>(null)
    const [coverName, setCoverName] = useState<string | null>(null)

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            author: "",
            voice: "rachel",
        },
    })

    async function onSubmit(values: FormValues) {
        setIsSynthesizing(true)
        console.log("Submitting form:", values)
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 3000))
        setIsSynthesizing(false)
    }

    const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            form.setValue("pdfFile", file)
            setPdfName(file.name)
        }
    }

    const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            form.setValue("coverImage", file)
            setCoverName(file.name)
        }
    }

    const removePdf = (e: React.MouseEvent) => {
        e.stopPropagation()
        form.resetField("pdfFile")
        setPdfName(null)
    }

    const removeCover = (e: React.MouseEvent) => {
        e.stopPropagation()
        form.resetField("coverImage")
        setCoverName(null)
    }

    return (
        <div className="new-book-wrapper">
            {isSynthesizing && <LoadingOverlay />}

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    {/* PDF Upload */}
                    <FormField
                        control={form.control}
                        name="pdfFile"
                        render={() => (
                            <FormItem>
                                <FormLabel className="form-label">Book PDF File</FormLabel>
                                <FormControl>
                                    <div
                                        className={cn(
                                            "upload-dropzone file-upload-shadow border-2 border-dashed border-[#8B7355]/30",
                                            pdfName && "upload-dropzone-uploaded"
                                        )}
                                        onClick={() => document.getElementById("pdf-upload")?.click()}
                                    >
                                        <input
                                            id="pdf-upload"
                                            type="file"
                                            accept=".pdf"
                                            className="hidden"
                                            onChange={handlePdfChange}
                                        />
                                        {pdfName ? (
                                            <div className="flex items-center gap-3">
                                                <span className="upload-dropzone-text truncate max-w-[200px]">{pdfName}</span>
                                                <div onClick={removePdf} className="upload-dropzone-remove">
                                                    <X size={20} />
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <Upload className="upload-dropzone-icon" />
                                                <span className="upload-dropzone-text">Click to upload PDF</span>
                                                <span className="upload-dropzone-hint">PDF file (max 50MB)</span>
                                            </>
                                        )}
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Cover Image Upload */}
                    <FormField
                        control={form.control}
                        name="coverImage"
                        render={() => (
                            <FormItem>
                                <FormLabel className="form-label">Cover Image (Optional)</FormLabel>
                                <FormControl>
                                    <div
                                        className={cn(
                                            "upload-dropzone file-upload-shadow border-2 border-dashed border-[#8B7355]/30",
                                            coverName && "upload-dropzone-uploaded"
                                        )}
                                        onClick={() => document.getElementById("cover-upload")?.click()}
                                    >
                                        <input
                                            id="cover-upload"
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleCoverChange}
                                        />
                                        {coverName ? (
                                            <div className="flex items-center gap-3">
                                                <span className="upload-dropzone-text truncate max-w-[200px]">{coverName}</span>
                                                <div onClick={removeCover} className="upload-dropzone-remove">
                                                    <X size={20} />
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <ImageIcon className="upload-dropzone-icon" />
                                                <span className="upload-dropzone-text">Click to upload cover image</span>
                                                <span className="upload-dropzone-hint">Leave empty to auto-generate from PDF</span>
                                            </>
                                        )}
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Title Input */}
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="form-label">Title</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="ex: Rich Dad Poor Dad"
                                        className="form-input shadow-soft-sm border-[var(--border-subtle)]"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Author Input */}
                    <FormField
                        control={form.control}
                        name="author"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="form-label">Author Name</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="ex: Robert Kiyosaki"
                                        className="form-input shadow-soft-sm border-[var(--border-subtle)]"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Voice Selector */}
                    <FormField
                        control={form.control}
                        name="voice"
                        render={({ field }) => (
                            <FormItem className="space-y-4">
                                <FormLabel className="form-label">Choose Assistant Voice</FormLabel>
                                <FormControl>
                                    <RadioGroup
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        className="space-y-6"
                                    >
                                        <div>
                                            <h4 className="text-sm font-medium text-[var(--text-secondary)] mb-3">Male Voices</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                {voices.male.map((voice) => (
                                                    <FormItem key={voice.id} className="space-y-0">
                                                        <FormControl>
                                                            <RadioGroupItem value={voice.id} className="sr-only" />
                                                        </FormControl>
                                                        <FormLabel
                                                            className={cn(
                                                                "voice-selector-option min-h-[100px] flex-col items-start justify-center p-4",
                                                                field.value === voice.id ? "voice-selector-option-selected" : "voice-selector-option-default"
                                                            )}
                                                        >
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <div className={cn(
                                                                    "w-4 h-4 rounded-full border flex items-center justify-center",
                                                                    field.value === voice.id ? "border-[#663820]" : "border-gray-300"
                                                                )}>
                                                                    {field.value === voice.id && <div className="w-2 h-2 rounded-full bg-[#663820]" />}
                                                                </div>
                                                                <span className="font-bold text-[#212a3b]">{voice.name}</span>
                                                            </div>
                                                            <span className="text-[10px] leading-tight text-[var(--text-secondary)]">{voice.desc}</span>
                                                        </FormLabel>
                                                    </FormItem>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="text-sm font-medium text-[var(--text-secondary)] mb-3">Female Voices</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {voices.female.map((voice) => (
                                                    <FormItem key={voice.id} className="space-y-0">
                                                        <FormControl>
                                                            <RadioGroupItem value={voice.id} className="sr-only" />
                                                        </FormControl>
                                                        <FormLabel
                                                            className={cn(
                                                                "voice-selector-option min-h-[100px] flex-col items-start justify-center p-4",
                                                                field.value === voice.id ? "voice-selector-option-selected" : "voice-selector-option-default"
                                                            )}
                                                        >
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <div className={cn(
                                                                    "w-4 h-4 rounded-full border flex items-center justify-center",
                                                                    field.value === voice.id ? "border-[#663820]" : "border-gray-300"
                                                                )}>
                                                                    {field.value === voice.id && <div className="w-2 h-2 rounded-full bg-[#663820]" />}
                                                                </div>
                                                                <span className="font-bold text-[#212a3b]">{voice.name}</span>
                                                            </div>
                                                            <span className="text-[10px] leading-tight text-[var(--text-secondary)]">{voice.desc}</span>
                                                        </FormLabel>
                                                    </FormItem>
                                                ))}
                                            </div>
                                        </div>
                                    </RadioGroup>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <button type="submit" className="form-btn shadow-soft-md">
                        Begin Synthesis
                    </button>
                </form>
            </Form>
        </div>
    )
}

export default UploadForm