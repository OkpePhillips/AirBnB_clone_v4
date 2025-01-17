# Use an official Python runtime as a parent image
FROM python:3.7-slim

# Set the working directory in the container to /app/web_flask
WORKDIR /app/web_flask

# Add the current directory contents into the container at /app/web_flask
ADD . /app/web_flask

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Make port 80 available to the world outside this container
EXPOSE 80

# Run your_file.py when the container launches
CMD ["python", "100-hbnb.py"]

