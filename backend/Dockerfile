# Use the official Python image as the base
FROM python:3.8-slim

# Set the working directory
WORKDIR /app

# Copy requirements.txt
COPY requirements.txt requirements.txt

# Upgrade pip and install dependencies
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# Copy the rest of the application files
COPY . .

# Expose the application port
EXPOSE 5000

# Run the application
CMD ["python", "app.py"]
