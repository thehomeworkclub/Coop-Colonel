from ultralytics import YOLO

model = YOLO("pt_model/best.pt")

results = model.predict(source="chicken.png", save=True)
for result in results:
    result.save("chicken_out.png")  
# images are not included in this repository