import { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../api";
import { ArrowLeft, ImagePlus, UploadCloud, X, Sparkles } from "lucide-react";

const TYPES = ["type1", "type2", "type3", "type4", "type5"];

export default function UploadProductImages() {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [files, setFiles] = useState({});
  const [previews, setPreviews] = useState({});
  const [loadingType, setLoadingType] = useState("");

  const onPick = (type, file) => {
    if (!file) return;

    setFiles((prev) => ({ ...prev, [type]: file }));
    setPreviews((prev) => ({ ...prev, [type]: URL.createObjectURL(file) }));
  };

  const removePicked = (type) => {
    setFiles((prev) => {
      const copy = { ...prev };
      delete copy[type];
      return copy;
    });
    setPreviews((prev) => {
      const copy = { ...prev };
      delete copy[type];
      return copy;
    });
  };

  const upload = async (type) => {
    const file = files[type];
    if (!file) return alert("Please select an image first");

    try {
      setLoadingType(type);

      const fd = new FormData();
      fd.append("type_name", type);
      fd.append("image", file);

      await api.post(`/admin/catalog/product/${productId}/type-image`, fd);

      alert(`${type.toUpperCase()} image uploaded ✅`);
      removePicked(type);
    } catch (err) {
      console.error(err);
      alert("Upload failed ❌");
    } finally {
      setLoadingType("");
    }
  };

  const pickedCount = useMemo(() => Object.keys(files).length, [files]);

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white border border-gray-200 shadow-soft font-extrabold text-sm text-[#0b0f19] hover:bg-gray-50 transition"
          >
            <ArrowLeft className="w-4 h-4 text-[#9d4edd]" />
            Back
          </button>

          <h1 className="mt-5 text-3xl md:text-4xl font-black text-[#0b0f19]">
            Upload Product Images
          </h1>
          <p className="text-gray-600 font-semibold mt-2">
            Upload type-wise images for product ID:{" "}
            <span className="font-black text-[#0b0f19]">{productId}</span>
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-gray-200 shadow-soft font-extrabold text-sm text-[#0b0f19]">
          <Sparkles className="w-4 h-4 text-[#9d4edd]" />
          Selected: {pickedCount}
        </div>
      </div>

      {/* MAIN CARD */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-soft p-7 md:p-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <h2 className="font-black text-xl text-[#0b0f19]">
            Upload Type Images
          </h2>

          <div className="text-xs font-extrabold text-gray-600">
            PNG / JPG recommended • Best: 800×800
          </div>
        </div>

        {/* TYPES GRID */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {TYPES.map((type) => {
            const file = files[type];
            const preview = previews[type];
            const isLoading = loadingType === type;

            return (
              <div
                key={type}
                className="
                  relative overflow-hidden rounded-3xl border border-gray-200 bg-white
                  shadow-[0_16px_40px_rgba(0,0,0,0.06)]
                  hover:-translate-y-1 transition
                "
              >
                {/* TOP */}
                <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                  <div className="text-xs font-black uppercase text-gray-900">
                    {type}
                  </div>

                  <div className="w-9 h-9 rounded-2xl bg-[#9d4edd]/10 flex items-center justify-center">
                    <ImagePlus className="w-4 h-4 text-[#9d4edd]" />
                  </div>
                </div>

                {/* PREVIEW */}
                <div className="relative h-36 bg-gray-100">
                  {preview ? (
                    <img
                      src={preview}
                      className="w-full h-full object-cover"
                      alt={type}
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-500">
                      <UploadCloud className="w-8 h-8" />
                      <div className="mt-2 text-xs font-bold">
                        No image selected
                      </div>
                    </div>
                  )}

                  {preview && (
                    <button
                      onClick={() => removePicked(type)}
                      className="absolute top-2 right-2 w-9 h-9 rounded-2xl bg-white/95 border border-gray-200 shadow flex items-center justify-center hover:scale-105 transition"
                      title="Remove selected"
                    >
                      <X className="w-5 h-5 text-red-600" />
                    </button>
                  )}
                </div>

                {/* PICK FILE */}
                <div className="p-4">
                  <label className="block cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={(e) => onPick(type, e.target.files?.[0])}
                    />

                    <div
                      className="
                        rounded-2xl border-2 border-dashed border-gray-300
                        px-4 py-3 text-center
                        text-sm font-extrabold text-[#0b0f19]
                        hover:bg-gray-50 transition
                      "
                    >
                      Choose File
                    </div>
                  </label>

                  {/* UPLOAD BTN */}
                  <button
                    disabled={!file || isLoading}
                    onClick={() => upload(type)}
                    className={`
                      mt-3 w-full rounded-2xl py-3 font-extrabold transition
                      ${
                        file && !isLoading
                          ? "bg-[#0b0f19] text-white hover:scale-[1.02] shadow-[0_18px_40px_rgba(0,0,0,0.18)]"
                          : "bg-gray-200 text-gray-500 cursor-not-allowed"
                      }
                    `}
                  >
                    {isLoading ? "Uploading..." : "Upload"}
                  </button>
                </div>

                {/* GOLD STRIP */}
                <div className="absolute inset-x-0 bottom-0 h-[3px] bg-gradient-to-r from-[#fff7c2] via-[#d4af37] to-[#a87412]" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
